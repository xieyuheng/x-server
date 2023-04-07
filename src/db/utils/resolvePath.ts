import { normalize, resolve } from "node:path"
import type { Database } from "../../database"
import { Unauthorized } from "../../errors/Unauthorized"

export function resolvePath(db: Database, path: string): string {
  const who = "resolvePath"

  const resolvedPath = normalize(resolve(db.path, path))

  if (!resolvedPath.startsWith(db.path)) {
    throw new Unauthorized(
      `[${who}] can not access path: ${path}, which is outside of database path`,
    )
  }

  return resolvedPath
}
