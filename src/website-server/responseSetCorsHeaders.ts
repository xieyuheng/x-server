import type Http from "node:http"
import { responseSetHeaders } from "../utils/node/responseSetHeaders"
import type { Context } from "./Context"

export function responseSetCorsHeaders(
  ctx: Context,
  response: Http.ServerResponse,
): void {
  responseSetHeaders(response, {
    "access-control-allow-origin": ctx.cors ? "*" : undefined,
  })
}
