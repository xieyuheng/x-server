import type { Buffer } from "node:buffer"
import type Http from "node:http"
import type { Json } from "../utils/Json"
import { requestURL } from "../utils/node/requestURL"
import type { Context } from "./Context"
import { handleDispatch } from "./handleDispatch"
import { handleSelf } from "./handleSelf"

export async function handle(
  ctx: Context,
  request: Http.IncomingMessage,
  response: Http.ServerResponse,
): Promise<Json | Buffer | void> {
  const url = requestURL(request)

  if (url.hostname === ctx.domain) {
    return await handleSelf(ctx, request, response)
  }

  return await handleDispatch(ctx, request, response)
}
