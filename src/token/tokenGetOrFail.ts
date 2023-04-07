import type { Database } from "../database"
import { dataGet } from "../db/dataGet"
import { Unauthorized } from "../errors/Unauthorized"
import { Token, TokenSchema } from "../token"
import { isValidTokenName } from "../token/isValidTokenName"

export async function tokenGetOrFail(
  db: Database,
  tokenName: string,
): Promise<Token> {
  const who = "tokenGetOrFail"

  if (!isValidTokenName(tokenName)) {
    throw new Unauthorized(`[${who}] invalid token name: ${tokenName}`)
  }

  const data = await dataGet(db, `tokens/${tokenName}`)

  if (data === undefined) {
    throw new Unauthorized(`[${who}] invalid token name: ${tokenName}`)
  }

  return TokenSchema.validate(data)
}
