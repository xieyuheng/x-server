import type Http from "node:http"
import { requestURLAlwaysWithHttpProtocol } from "./requestURLAlwaysWithHttpProtocol"

export function requestPathname(request: Http.IncomingMessage): string {
  return requestURLAlwaysWithHttpProtocol(request).pathname
}
