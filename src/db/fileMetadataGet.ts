import type { Database } from "../database"
import { NotFound } from "../errors/NotFound"
import { FileMetadata, fileMetadataGetOrFail } from "./fileMetadataGetOrFail"

export async function fileMetadataGet(
  db: Database,
  path: string,
): Promise<FileMetadata | undefined> {
  try {
    return await fileMetadataGetOrFail(db, path)
  } catch (error) {
    if (error instanceof NotFound) {
      return undefined
    }

    throw error
  }
}
