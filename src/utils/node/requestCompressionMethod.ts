import type Http from "node:http"

export function requestCompressionMethod(
  request: Http.IncomingMessage,
): string | undefined {
  if (typeof request.headers["accept-encoding"] === "string") {
    const encodings = request.headers["accept-encoding"].split(",")

    if (encodings.find((encoding) => encoding.trim().startsWith("br"))) {
      return "br"
    }

    if (encodings.find((encoding) => encoding.trim().startsWith("gzip"))) {
      return "gzip"
    }
  }
}
