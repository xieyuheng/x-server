import type { Buffer } from "node:buffer"
import type Http from "node:http"
import { normalize, resolve } from "node:path"
import { handlePreflight } from "../../server/handlePreflight"
import { findSubdomain } from "../../subdomain/findSubdomain"
import type { Json } from "../../utils/Json"
import { log } from "../../utils/log"
import { requestBasedomain } from "../../utils/node/requestBasedomain"
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
import { responseSendContent } from "../website/responseSendContent"
import type { Context } from "./Context"

export async function handle(
  ctx: Context,
  request: Http.IncomingMessage,
  response: Http.ServerResponse,
): Promise<Json | Buffer | void> {
  const who = "subdomain/handle"
  const hostname = requestHostname(request)
  const basedomain = requestBasedomain(request)
  const subdomain =
    ctx.domain === hostname
      ? "www"
      : ctx.domain === basedomain
      ? requestSubdomain(request, ctx.domain)
      : await findSubdomain(ctx.directory, hostname)
  const pathname = requestPathname(request)
  // NOTE `decodeURIComponent` is necessary for the space characters in url.
  const path = normalize(decodeURIComponent(pathname.slice(1)))
  const withLog = !ctx.config.logger?.disableRequestLogging

  if (subdomain === undefined) {
    const code = 404
    if (withLog)
      log({ who, hostname: ctx.domain, basedomain, subdomain, pathname, code })
    responseSetStatus(response, { code })
    responseSetHeaders(response, { connection: "close" })
    response.end()
    return
  }

  const subdirectory = normalize(resolve(ctx.directory, subdomain))
  const websiteConfig = await readWebsiteConfigFileOrDefault(
    `${subdirectory}/website.json`,
  )
  const config = mergeWebsiteConfigs([ctx.config, websiteConfig])

  if (request.method === "OPTIONS" && config.cors)
    return handlePreflight(request, response)

  if (withLog) log({ who, subdomain, pathname })

  if (request.method === "GET") {
    responseSetCorsHeaders(config, response)
    responseSetCacheControlHeaders(config, response, path)
    const content = await readContentWithRewrite(subdirectory, config, path)
    await responseSendContent(request, response, content, { withLog })
    return
  }

  throw new Error(
    [
      `[subdomain/handle] unhandled http request`,
      `  method: ${request.method}`,
    ].join("\n"),
  )
}
