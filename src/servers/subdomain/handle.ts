import type { Buffer } from "node:buffer"
import type Http from "node:http"
import { normalize, resolve } from "node:path"
import { handlePreflight } from "../../server/handlePreflight"
import type { Json } from "../../utils/Json"
import { compress } from "../../utils/node/compress"
import { requestCompressionMethod } from "../../utils/node/requestCompressionMethod"
import { requestPathname } from "../../utils/node/requestPathname"
import { requestSubdomain } from "../../utils/node/requestSubdomain"
import { responseSetHeaders } from "../../utils/node/responseSetHeaders"
import { responseSetStatus } from "../../utils/node/responseSetStatus"
import { readContentWithRewrite } from "../../website/readContentWithRewrite"
import { readWebsiteConfigFileOrDefault } from "../../website/readWebsiteConfigFileOrDefault"
import { responseSetCacheControlHeaders } from "../../website/responseSetCacheControlHeaders"
import { responseSetCorsHeaders } from "../../website/responseSetCorsHeaders"
import type { Context } from "./Context"

export async function handle(
  ctx: Context,
  request: Http.IncomingMessage,
  response: Http.ServerResponse,
): Promise<Json | Buffer | void> {
  const subdomain = requestSubdomain(request, ctx.domain)

  const subdirectory = normalize(resolve(ctx.directory, subdomain))
  const config = await readWebsiteConfigFileOrDefault(
    `${subdirectory}/website.json`,
  )

  if (config.cors) {
    if (request.method === "OPTIONS") {
      return handlePreflight(request, response)
    }
  }

  const pathname = requestPathname(request)

  // NOTE `decodeURIComponent` is necessary for the space characters in url.
  const path = normalize(decodeURIComponent(pathname.slice(1)))

  if (request.method === "GET") {
    responseSetCorsHeaders(config, response)
    responseSetCacheControlHeaders(config, response, path)

    const content = await readContentWithRewrite(subdirectory, config, path)

    if (content === undefined) {
      responseSetStatus(response, { code: 404 })
      responseSetHeaders(response, {
        connection: "close",
      })
      response.end()
      return
    }

    const compressionMethod = requestCompressionMethod(request)
    const buffer = await compress(compressionMethod, content.buffer)

    responseSetStatus(response, { code: 200 })
    responseSetHeaders(response, {
      "content-type": content.type,
      "content-encoding": compressionMethod,
      connection: "close",
    })
    response.end(buffer)
    return
  }

  throw new Error(
    [
      `[subdomain/handle] unhandled http request`,
      `  method: ${request.method}`,
    ].join("\n"),
  )
}
