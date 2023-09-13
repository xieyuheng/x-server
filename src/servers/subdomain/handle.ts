import type { Buffer } from "node:buffer"
import type Http from "node:http"
import { normalize, resolve } from "node:path"
import { handlePreflight } from "../../server/handlePreflight"
import { findSubdomain } from "../../subdomain/findSubdomain"
import type { Json } from "../../utils/Json"
import { log } from "../../utils/log"
import { compress } from "../../utils/node/compress"
import { requestBasedomain } from "../../utils/node/requestBasedomain"
import { requestCompressionMethod } from "../../utils/node/requestCompressionMethod"
import { requestHostname } from "../../utils/node/requestHostname"
import { requestPathname } from "../../utils/node/requestPathname"
import { requestSubdomain } from "../../utils/node/requestSubdomain"
import { responseSetHeaders } from "../../utils/node/responseSetHeaders"
import { responseSetStatus } from "../../utils/node/responseSetStatus"
import { mergeWebsiteConfigs } from "../../website/mergeWebsiteConfigs"
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
  const hostname = requestHostname(request)
  const basedomain = requestBasedomain(request)
  const pathname = requestPathname(request)

  const subdomain =
    ctx.domain === hostname
      ? "www"
      : ctx.domain === basedomain
      ? requestSubdomain(request, ctx.domain)
      : await findSubdomain(ctx.directory, hostname)

  const withLog = !ctx.config.logger?.disableRequestLogging

  if (subdomain === undefined) {
    const code = 404

    if (withLog)
      log({
        who: "subdomain/handle",
        message: "response",
        subdomain,
        hostname: ctx.domain,
        basedomain,
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

  const subdirectory = normalize(resolve(ctx.directory, subdomain))
  const config = mergeWebsiteConfigs([
    ctx.config,
    await readWebsiteConfigFileOrDefault(`${subdirectory}/website.json`),
  ])

  if (config.cors) {
    if (request.method === "OPTIONS") {
      return handlePreflight(request, response)
    }
  }

  // NOTE `decodeURIComponent` is necessary for the space characters in url.
  const path = normalize(decodeURIComponent(pathname.slice(1)))

  if (withLog)
    log({
      who: "subdomain/handle",
      message: "request",
      subdomain,
      pathname,
    })

  if (request.method === "GET") {
    responseSetCorsHeaders(config, response)
    responseSetCacheControlHeaders(config, response, path)

    const content = await readContentWithRewrite(subdirectory, config, path)

    if (content === undefined) {
      const code = 404

      if (withLog)
        log({
          who: "subdomain/handle",
          message: "response",
          subdomain,
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
        who: "subdomain/handle",
        message: "response",
        subdomain,
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
      `[subdomain/handle] unhandled http request`,
      `  method: ${request.method}`,
    ].join("\n"),
  )
}
