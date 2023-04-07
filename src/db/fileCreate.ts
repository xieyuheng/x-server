import type { Buffer } from "node:buffer"
import type { Database } from "../database"
import { AlreadyExists } from "../errors/AlreadyExists"
import { fileGet } from "./fileGet"
import { writeBuffer } from "./utils/writeBuffer"

export async function fileCreate(
  db: Database,
  path: string,
  buffer: Buffer,
): Promise<void> {
  const who = "fileCreate"

  const gotten = await fileGet(db, path)
  if (gotten !== undefined) {
    throw new AlreadyExists(`[${who}] already exists, path: ${path}`)
  }

  await writeBuffer(db, path, buffer)
}
