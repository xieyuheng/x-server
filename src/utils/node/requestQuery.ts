import type Http from "node:http"
import qs from "qs"
import { requestURLAlwaysWithHttpProtocol } from "./requestURLAlwaysWithHttpProtocol"

export function requestQuery(
  request: Http.IncomingMessage,
): Record<string, any> {
  const url = requestURLAlwaysWithHttpProtocol(request)
  return qs.parse(url.search.slice(1))
}
