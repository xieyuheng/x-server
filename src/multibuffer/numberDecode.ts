export function numberDecode(part: Uint8Array): number {
  return new DataView(part.buffer).getUint32(part.byteOffset)
}
