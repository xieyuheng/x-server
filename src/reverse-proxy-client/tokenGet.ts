import { env } from "../command-line/env"
import { createDatabase } from "../database"
import * as Db from "../db"
import { isJsonObject } from "../utils/Json"
import { stringTrimEnd } from "../utils/stringTrimEnd"

type Value = {
  token: string
  username: string
}

export async function tokenGet(url: string): Promise<Value | undefined> {
  const who = "reverse-proxy-client/tokenGet"

  const path = "reverse-proxy/tokens.json"

  const db = await createDatabase({ path: env.FIDB_SYSTEM_DB_DIR })

  const tokens = await Db.jsonFileGet(db, path)

  if (tokens === undefined) {
    return undefined
  }

  if (!isJsonObject(tokens)) {
    throw new Error(`[${who}] ${path} is not a JsonObject`)
  }

  const key = stringTrimEnd(url, "/")
  const value = tokens[key]

  if (value === undefined) {
    return undefined
  }

  return value as Value
}
