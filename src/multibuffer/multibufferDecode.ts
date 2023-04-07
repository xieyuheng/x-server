import { numberDecode } from "./numberDecode"

export function multibufferDecode(buffer: Uint8Array): Array<Uint8Array> {
  const parts = []

  let index = 0
  while (index < buffer.length) {
    const length = numberDecode(buffer.subarray(index, index + 4))
    index += 4
    const part = buffer.subarray(index, index + length)
    index += length
    parts.push(part)
  }

  return parts
}
