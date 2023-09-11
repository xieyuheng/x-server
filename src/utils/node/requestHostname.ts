import type Http from "node:http"
import { requestURLAlwaysWithHttpProtocol } from "./requestURLAlwaysWithHttpProtocol"

export function requestHostname(request: Http.IncomingMessage): string {
  const url = requestURLAlwaysWithHttpProtocol(request)
  return url.hostname
}
