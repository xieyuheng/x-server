import type { Buffer } from "node:buffer"
import type { Json } from "../Json"

export async function bufferJson(buffer: Buffer): Promise<Json> {
  const text = buffer.toString()
  const json = JSON.stringify(text)
  return json
}
