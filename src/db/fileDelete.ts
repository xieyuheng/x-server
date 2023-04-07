import type { Database } from "../database"
import { fileGet } from "./fileGet"
import { deletePath } from "./utils/deletePath"

export async function fileDelete(db: Database, path: string): Promise<void> {
  const gotten = await fileGet(db, path)
  if (gotten === undefined) {
    return
  }

  await deletePath(db, path)
}
