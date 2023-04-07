import type Http from "node:http"
import { requestURL } from "../utils/node/requestURL"
import { stringTrimEnd } from "../utils/stringTrimEnd"
import type { Context } from "./Context"

export function requestSubdomain(
  ctx: Context,
  request: Http.IncomingMessage,
): string | undefined {
  const url = requestURL(request)
  const length = url.hostname.length - ctx.domain.length
  const prefix = url.hostname.slice(0, length)
  if (prefix.endsWith(".")) {
    return stringTrimEnd(prefix, ".")
  } else {
    return undefined
  }
}
