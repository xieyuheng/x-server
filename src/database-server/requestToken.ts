import type Http from "node:http"
import { Unauthorized } from "../errors/Unauthorized"
import { Token, tokenGetOrFail } from "../token"
import { requestTokenName } from "../utils/node/requestTokenName"
import type { Context } from "./Context"

export async function requestToken(
  ctx: Context,
  request: Http.IncomingMessage,
): Promise<Token> {
  const tokenName = requestTokenName(request)

  if (tokenName === undefined) {
    throw new Unauthorized(`[requestToken] not token in authorization header`)
  }

  const token = await tokenGetOrFail(ctx.db, tokenName)
  return token
}
