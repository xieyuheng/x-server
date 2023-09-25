import type Http from "node:http"
import { normalize } from "node:path"
import { requestPathname } from "./requestPathname"

export function requestPath(request: Http.IncomingMessage): string {
  const pathname = requestPathname(request)
  // NOTE `decodeURIComponent` is necessary for the space characters in url.
  const path = normalize(decodeURIComponent(pathname.slice(1)))
  return path
}
