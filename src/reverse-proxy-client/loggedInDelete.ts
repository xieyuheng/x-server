import { env } from "../command-line/env"
import { createDatabase } from "../database"
import * as Db from "../db"
import { isJsonObject } from "../utils/Json"
import { stringTrimEnd } from "../utils/stringTrimEnd"

export async function loggedInDelete(url: string): Promise<boolean> {
  const who = "reverse-proxy-client/loggedInDelete"

  const path = "reverse-proxy/logged-in.json"

  const db = await createDatabase({ path: env.FIDB_SYSTEM_DB_DIR })

  const loggedInRecord = await Db.jsonFileGet(db, path)
  if (loggedInRecord === undefined) {
    return false
  }

  if (!isJsonObject(loggedInRecord)) {
    throw new Error(`[${who}] ${path} is not a JsonObject`)
  }

  const key = stringTrimEnd(url, "/")
  if (loggedInRecord[key] === undefined) {
    return false
  }

  delete loggedInRecord[key]
  await Db.jsonFilePut(db, path, loggedInRecord)
  return true
}
