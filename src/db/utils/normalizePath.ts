import { normalize } from "node:path"
import type { Database } from "../../database"
import { resolvePath } from "./resolvePath"

export function normalizePath(db: Database, path: string): string {
  const resolvedPath = resolvePath(db, path)
  const prefix = normalize(db.path + "/")
  return resolvedPath.slice(prefix.length)
}
