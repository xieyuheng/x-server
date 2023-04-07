import type Http from "node:http"

export function responseSetHeaders(
  response: Http.ServerResponse,
  headers: Record<string, string | undefined>,
) {
  for (const [name, value] of Object.entries(headers))
    if (value !== undefined) {
      response.setHeader(name, value)
    }
}
