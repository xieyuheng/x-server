import type { Buffer } from "node:buffer"
import type Http from "node:http"
import { normalize } from "node:path"
import { handlePreflight } from "../../server/handlePreflight"
import type { Json } from "../../utils/Json"
import { log } from "../../utils/log"
import { compress } from "../../utils/node/compress"
import { requestCompressionMethod } from "../../utils/node/requestCompressionMethod"
import { requestPathname } from "../../utils/node/requestPathname"
import { responseSetHeaders } from "../../utils/node/responseSetHeaders"
import { responseSetStatus } from "../../utils/node/responseSetStatus"
import { readContentWithRewrite } from "../../website/readContentWithRewrite"
import { responseSetCacheControlHeaders } from "../../website/responseSetCacheControlHeaders"
import { responseSetCorsHeaders } from "../../website/responseSetCorsHeaders"
import type { Context } from "./Context"

export async function handle(
  ctx: Context,
  request: Http.IncomingMessage,
  response: Http.ServerResponse,
): Promise<Json | Buffer | void> {
  const withLog = !ctx.config.server?.logger?.disableRequestLogging

  if (ctx.config.cors) {
    if (request.method === "OPTIONS") {
      return handlePreflight(request, response)
    }
  }

  const pathname = requestPathname(request)

  // NOTE `decodeURIComponent` is necessary for the space characters in url.
  const path = normalize(decodeURIComponent(pathname.slice(1)))

  if (withLog)
    log({
      who: "website/handle",
      message: "request",
      pathname,
    })

  if (request.method === "GET") {
    responseSetCorsHeaders(ctx.config, response)
    responseSetCacheControlHeaders(ctx.config, response, path)

    const content = await readContentWithRewrite(
      ctx.directory,
      ctx.config,
      path,
    )

    if (content === undefined) {
      const code = 404

      if (withLog)
        log({
          who: "website/handle",
          message: "response",
          pathname,
          code,
        })

      responseSetStatus(response, { code })
      responseSetHeaders(response, {
        connection: "close",
      })
      response.end()
      return
    }

    const compressionMethod = requestCompressionMethod(request)
    const buffer = await compress(compressionMethod, content.buffer)

    const code = 200

    if (withLog)
      log({
        who: "website/handle",
        message: "response",
        pathname,
        code,
        "content-type": content.type,
      })

    responseSetStatus(response, { code })
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
      `[website/handle] unhandled http request`,
      `  method: ${request.method}`,
    ].join("\n"),
  )
}
