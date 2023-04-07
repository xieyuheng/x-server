import fs from "node:fs"
import type { Database } from "../database"
import { NotFound } from "../errors/NotFound"
import { isErrnoException } from "../utils/node/isErrnoException"
import { resolvePath } from "./utils/resolvePath"

export type FileMetadata = {
  size: number
}

export async function fileMetadataGetOrFail(
  db: Database,
  path: string,
): Promise<FileMetadata> {
  const who = "fileMetadataGetOrFail"

  try {
    const stats = await fs.promises.stat(resolvePath(db, path))
    return { size: stats.size }
  } catch (error) {
    if (isErrnoException(error) && error.code === "ENOENT") {
      throw new NotFound(`[${who}] path: ${path}`)
    }

    throw error
  }
}
