import type Http from "node:http"
import { globMatch } from "../utils/globMatch"
import { responseSetHeaders } from "../utils/node/responseSetHeaders"
import type { Context } from "./Context"

export function responseSetCacheControlHeaders(
  ctx: Context,
  response: Http.ServerResponse,
  path: string,
): void {
  const cacheControlHeaders: Record<string, string> = {}
  for (const [pattern, value] of Object.entries(ctx.cacheControlPatterns)) {
    if (globMatch(pattern, path)) {
      cacheControlHeaders["cache-control"] = value
    }
  }

  responseSetHeaders(response, cacheControlHeaders)
}
