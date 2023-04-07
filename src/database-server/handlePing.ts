import type Http from "node:http"
import type { Json } from "../utils/Json"
import type { Context } from "./Context"

export async function handlePing(
  ctx: Context,
  request: Http.IncomingMessage,
): Promise<Json | void> {
  if (request.method === "GET") {
    return "pong"
  }

  throw new Error(
    [`[handlePing] unhandled http request`, `  method: ${request.method}`].join(
      "\n",
    ),
  )
}
