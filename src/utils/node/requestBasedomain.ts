import type Http from "node:http"
import { requestURLAlwaysWithHttpProtocol } from "./requestURLAlwaysWithHttpProtocol"

export function requestBasedomain(
  request: Http.IncomingMessage,
): string {
  const url = requestURLAlwaysWithHttpProtocol(request)

  const [subdomain, ...rest] = url.hostname.split(".")
  const basedomain = rest.join(".")

  return subdomain
}
