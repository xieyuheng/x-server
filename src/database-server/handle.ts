import type { Buffer } from "node:buffer"
import type Http from "node:http"
import * as Db from "../db"
import { handlePreflight } from "../server/handlePreflight"
import type { Json } from "../utils/Json"
import { requestKind } from "../utils/node/requestKind"
import type { Context } from "./Context"
import { handleData } from "./handleData"
import { handleDirectory } from "./handleDirectory"
import { handleFile } from "./handleFile"
import { handleInfo } from "./handleInfo"
import { handlePassword } from "./handlePassword"
import { handlePing } from "./handlePing"
import { requestPath } from "./requestPath"

export async function handle(
  ctx: Context,
  request: Http.IncomingMessage,
  response: Http.ServerResponse,
): Promise<Json | Buffer | void> {
  if (request.method === "OPTIONS") {
    return handlePreflight(request, response)
  }

  const kind = requestKind(request)
  const path = requestPath(ctx, request)

  if (await Db.isFile(ctx.db, path)) {
    return await handleFile(ctx, request)
  }

  if (kind.startsWith("data") || kind === "") {
    return await handleData(ctx, request)
  }

  if (kind.startsWith("file")) {
    return await handleFile(ctx, request)
  }

  if (kind.startsWith("directory")) {
    return await handleDirectory(ctx, request)
  }

  if (kind.startsWith("password")) {
    return await handlePassword(ctx, request)
  }

  if (kind.startsWith("info")) {
    return await handleInfo(ctx, request)
  }

  if (kind.startsWith("ping")) {
    return await handlePing(ctx, request)
  }

  throw new Error(
    [
      `[handle] unhandled content-type`,
      `  method: ${request.method}`,
      `  path: ${requestPath(ctx, request)}`,
    ].join("\n"),
  )
}
