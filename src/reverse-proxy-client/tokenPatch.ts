import { env } from "../command-line/env"
import { createDatabase } from "../database"
import * as Db from "../db"
import { stringTrimEnd } from "../utils/stringTrimEnd"

type Value = {
  token: string
  username: string
}

export async function tokenPatch(
  urls: Array<string>,
  value: Value,
): Promise<void> {
  const path = "reverse-proxy/tokens.json"

  const db = await createDatabase({ path: env.FIDB_SYSTEM_DB_DIR })

  if (!(await Db.jsonFileGet(db, path))) {
    await Db.jsonFileCreate(db, path, {})
  }

  await Db.jsonFilePatch(
    db,
    path,
    Object.fromEntries(
      urls.map((url) => [stringTrimEnd(new URL(url).href, "/"), value]),
    ),
  )
}
