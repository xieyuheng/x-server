import type Http from "node:http"
import { requestURLAlwaysWithHttpProtocol } from "./requestURLAlwaysWithHttpProtocol"

export function requestSubdomain(
  request: Http.IncomingMessage,
  domain: string,
): string {
  const url = requestURLAlwaysWithHttpProtocol(request)

  const [head, ...rest] = url.hostname.split(".")
  const requestedDomain = rest.join(".")

  if (requestedDomain !== domain) {
    throw new Error(
      [
        `[requestSubdomain] I domain mismatch.`,
        ``,
        `  expected domain: ${domain}`,
        `  requested domain: ${requestedDomain}`,
      ].join("\n"),
    )
  }

  return head
}
