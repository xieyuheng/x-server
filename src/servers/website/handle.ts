import type { Buffer } from "node:buffer"
import type Http from "node:http"
import { normalize } from "node:path"
import { handlePreflight } from "../../server/handlePreflight"
import type { Json } from "../../utils/Json"
import { log } from "../../utils/log"
import { requestPathname } from "../../utils/node/requestPathname"
import { readContentWithRewrite } from "../../website/readContentWithRewrite"
import { responseSetCacheControlHeaders } from "../../website/responseSetCacheControlHeaders"
import { responseSetCorsHeaders } from "../../website/responseSetCorsHeaders"
import type { Context } from "./Context"
import { responseSendContent } from "./responseSendContent"

export async function handle(
  ctx: Context,
  request: Http.IncomingMessage,
  response: Http.ServerResponse,
): Promise<Json | Buffer | void> {
  const who = "website/handle"
  const withLog = !ctx.config.logger?.disableRequestLogging
  const pathname = requestPathname(request)
  // NOTE `decodeURIComponent` is necessary for the space characters in url.
  const path = normalize(decodeURIComponent(pathname.slice(1)))

  if (request.method === "OPTIONS" && ctx.config.cors)
    return handlePreflight(request, response)

  if (withLog) log({ who, pathname })

  if (request.method === "GET") {
    responseSetCorsHeaders(ctx.config, response)
    responseSetCacheControlHeaders(ctx.config, response, path)
    const { directory, config } = ctx
    const content = await readContentWithRewrite(directory, config, path)
    await responseSendContent(request, response, content, { withLog })
    return
  }

  throw new Error(
    [
      `[website/handle] unhandled http request`,
      `  method: ${request.method}`,
    ].join("\n"),
  )
}
