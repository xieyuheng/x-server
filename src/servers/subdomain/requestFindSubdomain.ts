import type Http from "node:http"
import { requestBasedomain } from "../../utils/node/requestBasedomain"
import { requestHostname } from "../../utils/node/requestHostname"
import { requestSubdomain } from "../../utils/node/requestSubdomain"
import { Context } from "./Context"
import { findSubdomain } from "./findSubdomain"

export async function requestFindSubdomain(
  ctx: Context,
  request: Http.IncomingMessage,
): Promise<string | undefined> {
  const hostname = requestHostname(request)
  const basedomain = requestBasedomain(request)

  const subdomain =
    ctx.domain === hostname
      ? "www"
      : ctx.domain === basedomain
      ? requestSubdomain(request, ctx.domain)
      : await findSubdomain(ctx.directory, hostname)

  return subdomain
}
