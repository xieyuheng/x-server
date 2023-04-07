import { Schema, ty } from "@xieyuheng/ty"
import type { JsonObject } from "../utils/Json"

export type Data = JsonObject & {
  "@path": string
  "@revision": string
  "@createdAt": number
  "@updatedAt": number
}

export const DataSchema: Schema<Data> = ty.object({
  "@path": ty.string(),
  "@revision": ty.string(),
  "@createdAt": ty.number(),
  "@updatedAt": ty.number(),
})
