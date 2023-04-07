import { Buffer } from "node:buffer"
import type { Database } from "../database"
import { NotFound } from "../errors/NotFound"
import { Unprocessable } from "../errors/Unprocessable"
import { isJsonObject, JsonObject } from "../utils/Json"
import { jsonFileGet } from "./jsonFileGet"
import { writeBuffer } from "./utils/writeBuffer"

export async function jsonFilePatch(
  db: Database,
  path: string,
  jsonObject: JsonObject,
): Promise<void> {
  const gotten = await jsonFileGet(db, path)
  if (gotten === undefined) {
    throw new NotFound(`[jsonFilePatch] not found, path ${path}`)
  }

  if (!isJsonObject(gotten)) {
    throw new Unprocessable(`[jsonFilePatch] expect json object, path ${path}`)
  }

  await writeBuffer(
    db,
    path,
    Buffer.from(
      JSON.stringify({
        ...gotten,
        ...jsonObject,
      }),
    ),
  )
}
