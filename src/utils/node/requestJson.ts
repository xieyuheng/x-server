import type Http from "node:http"
import type { Json } from "../Json"
import { requestText } from "./requestText"
import { requestURLAlwaysWithHttpProtocol } from "./requestURLAlwaysWithHttpProtocol"

export async function requestJson(
  request: Http.IncomingMessage,
): Promise<Json> {
  const who = "requestJson"

  const text = await requestText(request)

  try {
    return JSON.parse(text)
  } catch (error) {
    if (error instanceof SyntaxError) {
      const url = requestURLAlwaysWithHttpProtocol(request)
      const message = `[${who}] request url: ${url}, text: ${text}`
      error.message += "\n"
      error.message += message
    }

    throw error
  }
}
