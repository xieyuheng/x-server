import type Http from "node:http"
import { requestURL } from "./requestURL"

export function requestPathname(request: Http.IncomingMessage): string {
  return requestURL(request).pathname
}
