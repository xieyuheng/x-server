import { normalize } from "node:path"
import { Data, randomRevision } from "../data"
import type { Database } from "../database"
import { AlreadyExists } from "../errors/AlreadyExists"
import type { JsonObject } from "../utils/Json"
import { dataGet } from "./dataGet"
import { writeData } from "./utils/writeData"

export async function dataCreate(
  db: Database,
  path: string,
  input: JsonObject,
): Promise<Data> {
  const who = "dataCreate"

  const data = await dataGet(db, path)
  if (data !== undefined) {
    throw new AlreadyExists(`[${who}] already exists, path: ${path}`)
  }

  const result = {
    ...input,
    "@path": normalize(path),
    "@revision": randomRevision(),
    "@createdAt": Date.now(),
    "@updatedAt": Date.now(),
  }

  await writeData(db, path, result)

  return result
}
