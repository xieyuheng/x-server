import type Http from "node:http"
import { requestHostname } from "./requestHostname"

export function requestSubdomain(
  request: Http.IncomingMessage,
  domain: string,
): string {
  const hostname = requestHostname(request)
  const [subdomain, ...rest] = hostname.split(".")
  const basedomain = rest.join(".")

  if (basedomain !== domain) {
    throw new Error(
      [
        `[requestSubdomain] I found basedomain mismatch.`,
        ``,
        `  expected basedomain: ${domain}`,
        `  requested basedomain: ${basedomain}`,
        `  subdomain: ${subdomain}`,
      ].join("\n"),
    )
  }

  return subdomain
}
