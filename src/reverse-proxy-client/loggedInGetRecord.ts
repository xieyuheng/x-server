import { env } from "../command-line/env"
import { createDatabase } from "../database"
import * as Db from "../db"
import { isJsonObject } from "../utils/Json"

type Value = {
  username: string
}

export async function loggedInGetRecord(): Promise<Record<string, Value>> {
  const who = "reverse-proxy-client/loggedInGetRecord"

  const path = "reverse-proxy/logged-in.json"

  const db = await createDatabase({ path: env.FIDB_SYSTEM_DB_DIR })

  const loggedInRecord = await Db.jsonFileGet(db, path)
  if (loggedInRecord === undefined) {
    return {}
  }

  if (!isJsonObject(loggedInRecord)) {
    throw new Error(`[${who}] ${path} is not a JsonObject`)
  }

  return loggedInRecord as any
}
