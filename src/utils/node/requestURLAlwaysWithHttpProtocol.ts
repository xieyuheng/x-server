import type Http from "node:http"

export function requestURLAlwaysWithHttpProtocol(
  request: Http.IncomingMessage,
): URL {
  if (request.url === undefined) {
    throw new Error("[requestURLAlwaysWithHttpProtocol] expect request.url")
  }

  const protocol = "http"

  // NOTE For https request, the `protocol` might be wrong,
  //   this function should only be used to parse url,
  //   we should no rely on the `protocol` of the resulting url.

  return new URL(request.url, `${protocol}://${request.headers.host}`)
}
