import type { Database } from "../../database"
import { resolvePath } from "./resolvePath"

export function resolveDataPath(db: Database, path: string): string {
  const postfix = "/index.json"
  return resolvePath(db, path + postfix)
}
