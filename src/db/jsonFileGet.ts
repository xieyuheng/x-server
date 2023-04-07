import type { Database } from "../database"
import { NotFound } from "../errors/NotFound"
import type { Json } from "../utils/Json"
import { fileGetOrFail } from "./fileGetOrFail"

export async function jsonFileGet(
  db: Database,
  path: string,
): Promise<Json | undefined> {
  try {
    const who = "jsonFileGet"

    const buffer = await fileGetOrFail(db, path)
    const text = buffer.toString()

    try {
      return JSON.parse(text)
    } catch (error) {
      if (error instanceof SyntaxError) {
        const message = `[${who}] db name: ${db.config.name}, path: ${path}, text: ${text}`
        error.message += "\n"
        error.message += message
      }

      throw error
    }
  } catch (error) {
    if (error instanceof NotFound) {
      return undefined
    }

    throw error
  }
}
