import type { Buffer } from "node:buffer"
import type Http from "node:http"
import { handleData } from "../database-server/handleData"
import { handlePassword } from "../database-server/handlePassword"
import { handlePreflight } from "../server/handlePreflight"
import type { Json } from "../utils/Json"
import { requestKind } from "../utils/node/requestKind"
import type { Context } from "./Context"
import { handleChannel } from "./handleChannel"
import { handleInfo } from "./handleInfo"
import { handlePing } from "./handlePing"

export async function handleSelf(
  ctx: Context,
  request: Http.IncomingMessage,
  response: Http.ServerResponse,
): Promise<Json | Buffer | void> {
  if (request.method === "OPTIONS") {
    return handlePreflight(request, response)
  }

  const kind = requestKind(request)

  if (kind.startsWith("data") || kind === "") {
    return await handleData(ctx, request)
  }

  if (kind.startsWith("ping")) {
    return await handlePing(ctx, request)
  }

  if (kind.startsWith("info")) {
    return await handleInfo(ctx, request)
  }

  if (kind.startsWith("password")) {
    if (kind === "password-register") {
      throw new Error(`[handleSelf] password-register is currently not enabled`)
    }

    return await handlePassword(ctx, request)
  }

  if (kind.startsWith("channel")) {
    return await handleChannel(ctx, request)
  }

  throw new Error(
    [
      `[handleSelf] unhandled content-type`,
      `  method: ${request.method}`,
      `  kind: ${kind}`,
    ].join("\n"),
  )
}
