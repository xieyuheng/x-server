import type { Database } from "../database"
import { AlreadyExists } from "../errors/AlreadyExists"
import type { Json } from "../utils/Json"
import { fileGet } from "./fileGet"
import { writeBuffer } from "./utils/writeBuffer"

export async function jsonFileCreate(
  db: Database,
  path: string,
  json: Json,
): Promise<void> {
  const gotten = await fileGet(db, path)
  if (gotten !== undefined) {
    throw new AlreadyExists(`[jsonFileCreate] already exists, @path: ${path}`)
  }

  await writeBuffer(db, path, Buffer.from(JSON.stringify(json)))
}
