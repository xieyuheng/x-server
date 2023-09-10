import type Http from "node:http"
import { requestURLAlwaysWithHttpProtocol } from "./requestURLAlwaysWithHttpProtocol"

export function requestSubdomain(request: Http.IncomingMessage): string {
  const url = requestURLAlwaysWithHttpProtocol(request)
  const parts = url.hostname.split(".")
  return parts[0]
}
