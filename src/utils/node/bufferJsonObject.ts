import type { Buffer } from "node:buffer"
import { isJsonObject, JsonObject } from "../Json"

export async function bufferJsonObject(buffer: Buffer): Promise<JsonObject> {
  const text = buffer.toString()
  const json = JSON.stringify(text)
  if (!isJsonObject(json)) {
    throw new Error(
      [
        `[bufferJsonObject] expect JsonObject`,
        `  json: ${JSON.stringify(json)}`,
      ].join("\n"),
    )
  }

  return json
}
