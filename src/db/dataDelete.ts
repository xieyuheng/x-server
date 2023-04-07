import type { Database } from "../database"
import { RevisionMismatch } from "../errors/RevisionMismatch"
import type { JsonObject } from "../utils/Json"
import { dataGet } from "./dataGet"
import { deletePathRecursive } from "./utils/deletePath"

export async function dataDelete(
  db: Database,
  path: string,
  input: JsonObject,
): Promise<void> {
  const who = "dataDelete"

  const data = await dataGet(db, path)
  if (data === undefined) {
    return
  }

  if (data["@revision"] !== input["@revision"]) {
    throw new RevisionMismatch(`[${who}] revision mismatch`)
  }

  await deletePathRecursive(db, path)
}
