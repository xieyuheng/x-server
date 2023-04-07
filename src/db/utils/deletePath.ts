import fs from "node:fs"
import type { Database } from "../../database"
import { resolvePath } from "./resolvePath"

export async function deletePath(db: Database, path: string): Promise<void> {
  await fs.promises.rm(resolvePath(db, path), {
    force: true,
  })
}

export async function deletePathRecursive(
  db: Database,
  path: string,
): Promise<void> {
  await fs.promises.rm(resolvePath(db, path), {
    recursive: true,
    force: true,
  })
}
