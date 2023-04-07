import { Data } from "../data"
import type { Database } from "../database"
import { NotFound } from "../errors/NotFound"
import { isErrnoException } from "../utils/node/isErrnoException"
import { readData } from "./utils/readData"

export async function dataGetOrFail(db: Database, path: string): Promise<Data> {
  const who = "dataGetOrFail"

  try {
    return await readData(db, path)
  } catch (error) {
    if (isErrnoException(error) && error.code === "ENOENT") {
      throw new NotFound(`[${who}] path: ${path}`)
    }

    throw error
  }
}
