import fs from "node:fs"
import type { Json } from "../Json"

export async function readJson(path: string): Promise<Json> {
  const who = "readJson"

  const text = await fs.promises.readFile(path, "utf-8")

  try {
    return JSON.parse(text)
  } catch (error) {
    if (error instanceof SyntaxError) {
      const message = `[${who}] request path: ${path}, text: ${text}`
      error.message += "\n"
      error.message += message
    }

    throw error
  }
}
