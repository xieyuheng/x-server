export function byteArrayMerge(parts: Array<Uint8Array>): Uint8Array {
  const length = parts.reduce((sum, part) => sum + part.length, 0)
  const result = new Uint8Array(length)

  let index = 0
  for (const part of parts) {
    result.set(part, index)
    index += part.length
  }

  return result
}
