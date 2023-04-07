import { env } from "../command-line/env"
import { createDatabase } from "../database"
import * as Db from "../db"
import { isJsonObject } from "../utils/Json"
import { stringTrimEnd } from "../utils/stringTrimEnd"

type Value = {
  username: string
}

export async function loggedInGet(url: string): Promise<Value | undefined> {
  const who = "reverse-proxy-client/loggedInGet"

  const path = "reverse-proxy/logged-in.json"

  const db = await createDatabase({ path: env.FIDB_SYSTEM_DB_DIR })

  const loggedInRecord = await Db.jsonFileGet(db, path)
  if (loggedInRecord === undefined) {
    return undefined
  }

  if (!isJsonObject(loggedInRecord)) {
    throw new Error(`[${who}] ${path} is not a JsonObject`)
  }

  const key = stringTrimEnd(url, "/")
  const value = loggedInRecord[key]

  if (value === undefined) {
    return undefined
  }

  return value as Value
}
