import type { Buffer } from "node:buffer"
import fs from "node:fs"
import { dirname } from "node:path"
import type { Database } from "../../database"
import { resolvePath } from "./resolvePath"

export async function writeBuffer(
  db: Database,
  path: string,
  buffer: Buffer,
): Promise<void> {
  await fs.promises.mkdir(dirname(resolvePath(db, path)), { recursive: true })
  await fs.promises.writeFile(resolvePath(db, path), buffer)
}
