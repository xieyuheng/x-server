import type Http from "node:http"

export function requestURL(request: Http.IncomingMessage): URL {
  if (request.url === undefined) {
    throw new Error("[requestURL] expect request.url")
  }

  const protocol = "http"

  return new URL(request.url, `${protocol}://${request.headers.host}`)
}
