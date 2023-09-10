import type Http from "node:http"
import { responseSetHeaders } from "../utils/node/responseSetHeaders"
import { WebsiteConfig } from "./WebsiteConfig"

export function responseSetCorsHeaders(
  config: WebsiteConfig,
  response: Http.ServerResponse,
): void {
  responseSetHeaders(response, {
    "access-control-allow-origin": config.cors ? "*" : undefined,
  })
}
