import type Http from "node:http"
import { requestHostname } from "./requestHostname"

export function requestBasedomain(request: Http.IncomingMessage): string {
  const hostname = requestHostname(request)
  const [subdomain, ...rest] = hostname.split(".")
  const basedomain = rest.join(".")

  return subdomain
}
