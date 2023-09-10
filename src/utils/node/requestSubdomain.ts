import type Http from "node:http"
import { requestURL } from "./requestURL"

export function requestSubdomain(request: Http.IncomingMessage): string {
  const url = requestURL(request)
  const parts = url.hostname.split(".")
  return parts[0]
}
