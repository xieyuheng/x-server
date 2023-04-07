import type { Buffer } from "node:buffer"
import type { Database } from "../database"
import { NotFound } from "../errors/NotFound"
import { fileGetOrFail } from "./fileGetOrFail"

export async function fileGet(
  db: Database,
  path: string,
): Promise<Buffer | undefined> {
  try {
    return await fileGetOrFail(db, path)
  } catch (error) {
    if (error instanceof NotFound) {
      return undefined
    }

    throw error
  }
}
