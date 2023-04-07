import type Http from "node:http"

export function requestTokenName(
  request: Http.IncomingMessage,
): string | undefined {
  if (!request.headers["authorization"]) {
    return
  }

  const authorization = request.headers["authorization"].toLowerCase()

  if (!authorization.startsWith("token")) {
    return
  }

  return authorization.slice("token".length).trim()
}
