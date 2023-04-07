import type Http from "node:http"
import { requestQuery } from "./requestQuery"

export function requestKind(request: Http.IncomingMessage): string {
  const query = requestQuery(request)
  const kind = query.kind ? query.kind.toLowerCase() : ""
  return kind
}
