export function numberEncode(n: number): Uint8Array {
  const buffer = new ArrayBuffer(4)
  // NOTE We use big-endian -- network byte order,
  // which is the default of `DataView`.
  new DataView(buffer).setUint32(0, n)
  return new Uint8Array(buffer)
}
