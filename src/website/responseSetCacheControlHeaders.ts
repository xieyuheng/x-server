import type Http from "node:http"
import { globMatch } from "../utils/globMatch"
import { responseSetHeaders } from "../utils/node/responseSetHeaders"
import { WebsiteConfig } from "./WebsiteConfig"

export function responseSetCacheControlHeaders(
  config: WebsiteConfig,
  response: Http.ServerResponse,
  path: string,
): void {
  const cacheControlHeaders: Record<string, string> = {}
  for (const [pattern, value] of Object.entries(
    config.cacheControlPatterns || {},
  )) {
    if (globMatch(pattern, path)) {
      cacheControlHeaders["cache-control"] = value
    }
  }

  responseSetHeaders(response, cacheControlHeaders)
}
