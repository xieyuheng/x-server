import type { Buffer } from "node:buffer"
import type Http from "node:http"
import { normalize } from "node:path"
import { promisify } from "node:util"
import Zlib from "node:zlib"
import { handlePreflight } from "../server/handlePreflight"
import type { Json } from "../utils/Json"
import { compress } from "../utils/node/compress"
import { requestCompressionMethod } from "../utils/node/requestCompressionMethod"
import { requestURL } from "../utils/node/requestURL"
import { responseSetHeaders } from "../utils/node/responseSetHeaders"
import { responseSetStatus } from "../utils/node/responseSetStatus"
import type { Context } from "./Context"
import { readContentWithRewrite } from "./readContentWithRewrite"
import { responseSetCacheControlHeaders } from "./responseSetCacheControlHeaders"
import { responseSetCorsHeaders } from "./responseSetCorsHeaders"

const brotliCompress = promisify(Zlib.brotliCompress)
const gzip = promisify(Zlib.gzip)

export async function handle(
  ctx: Context,
  request: Http.IncomingMessage,
  response: Http.ServerResponse,
): Promise<Json | Buffer | void> {
  if (ctx.cors) {
    if (request.method === "OPTIONS") {
      return handlePreflight(request, response)
    }
  }

  const url = requestURL(request)

  // NOTE `decodeURIComponent` is necessary for space.
  const path = normalize(decodeURIComponent(url.pathname.slice(1)))

  if (request.method === "GET") {
    responseSetCorsHeaders(ctx, response)
    responseSetCacheControlHeaders(ctx, response, path)

    const content = await readContentWithRewrite(ctx, path)
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
    [`[handle] unhandled http request`, `  method: ${request.method}`].join(
      "\n",
    ),
  )
}
