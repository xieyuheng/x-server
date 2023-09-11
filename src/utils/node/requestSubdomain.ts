import type Http from "node:http"
import { requestURLAlwaysWithHttpProtocol } from "./requestURLAlwaysWithHttpProtocol"

export function requestSubdomain(
  request: Http.IncomingMessage,
  domain: string,
): string {
  const url = requestURLAlwaysWithHttpProtocol(request)

  const [subdomain, ...rest] = url.hostname.split(".")
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
