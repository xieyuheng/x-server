import { byteArrayMerge } from "../utils/byteArrayMerge"
import { numberEncode } from "./numberEncode"

export function multibufferEncode(parts: Array<Uint8Array>): Uint8Array {
  return byteArrayMerge(
    parts.flatMap((part) => [numberEncode(part.length), part]),
  )
}
