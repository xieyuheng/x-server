import fs from "node:fs"
import type { Database } from "../database"
import { resolvePath } from "./utils/resolvePath"

export async function directoryCreate(
  db: Database,
  directory: string,
): Promise<void> {
  await fs.promises.mkdir(resolvePath(db, directory), {
    recursive: true,
  })
}
