import fs from "node:fs"
import { dirname } from "node:path"
import type { Json } from "../Json"

export async function writeJson(path: string, input: Json): Promise<void> {
  const text = JSON.stringify(input)
  await fs.promises.mkdir(dirname(path), { recursive: true })
  await fs.promises.writeFile(path, text)
}
