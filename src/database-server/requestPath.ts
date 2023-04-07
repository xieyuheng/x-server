import type Http from "node:http"
import { normalizePath } from "../db/utils/normalizePath"
import { requestURL } from "../utils/node/requestURL"
import type { Context } from "./Context"

export function requestPath(
  ctx: Context,
  request: Http.IncomingMessage,
): string {
  const url = requestURL(request)

  // NOTE `decodeURIComponent` is necessary for space.

  // For example
  //   'users/abc%20123'
  // will be decode to
  //   'users/abc 123'

  const path = normalizePath(ctx.db, decodeURIComponent(url.pathname.slice(1)))

  return path
}
