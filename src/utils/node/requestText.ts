import type Http from "node:http"
import { requestBuffer } from "./requestBuffer"

export async function requestText(
  request: Http.IncomingMessage,
): Promise<string> {
  const buffer = await requestBuffer(request)
  return buffer.toString()
}
