import type Http from "node:http"

export type RequestListener = (
  request: Http.IncomingMessage,
  response: Http.ServerResponse,
) => Promise<void>
