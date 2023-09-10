import type { Buffer } from "node:buffer"
import type Http from "node:http"
import { normalize } from "node:path"
import type { Json } from "../../utils/Json"
import { requestURLAlwaysWithHttpProtocol } from "../../utils/node/requestURLAlwaysWithHttpProtocol"
import type { Context } from "./Context"

export async function handle(
  ctx: Context,
  request: Http.IncomingMessage,
  response: Http.ServerResponse,
): Promise<Json | Buffer | void> {
  // if (ctx.config.cors) {
  //   if (request.method === "OPTIONS") {
  //     return handlePreflight(request, response)
  //   }
  // }

  const url = requestURLAlwaysWithHttpProtocol(request)

  // NOTE `decodeURIComponent` is necessary for the space characters in url.
  const path = normalize(decodeURIComponent(url.pathname.slice(1)))

  if (request.method === "GET") {
    // responseSetCorsHeaders(ctx, response)
    // responseSetCacheControlHeaders(ctx, response, path)

    // const content = await readContentWithRewrite(ctx, path)
    // if (content === undefined) {
    //   responseSetStatus(response, { code: 404 })
    //   responseSetHeaders(response, {
    //     connection: "close",
    //   })
    //   response.end()
    //   return
    // }

    // const compressionMethod = requestCompressionMethod(request)
    // const buffer = await compress(compressionMethod, content.buffer)

    // responseSetStatus(response, { code: 200 })
    // responseSetHeaders(response, {
    //   "content-type": content.type,
    //   "content-encoding": compressionMethod,
    //   connection: "close",
    // })
    // response.end(buffer)
    return
  }

  throw new Error(
    [
      `[subdomain/handle] unhandled http request`,
      `  method: ${request.method}`,
    ].join("\n"),
  )
}
