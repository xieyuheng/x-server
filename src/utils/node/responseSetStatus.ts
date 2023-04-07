import type Http from "node:http"

export function responseSetStatus(
  response: Http.ServerResponse,
  status: {
    code?: number
    message?: string
  },
) {
  if (status?.code) {
    response.statusCode = status.code
  }

  if (status?.message) {
    const message = status.message.replaceAll("\n", "; ")
    response.statusMessage = message
  }
}
