import type { Socket } from "node:net"
import { byteArrayMerge } from "../utils/byteArrayMerge"

export async function* lengthPrefixedDataStreamFromSocket(socket: Socket) {
  const prefixLength = 4

  let buffer = new Uint8Array()
  let length = undefined

  for await (const data of socket) {
    buffer = byteArrayMerge([buffer, data])
    length = new DataView(buffer.buffer).getUint32(buffer.byteOffset)

    while (length !== undefined && buffer.length >= length + prefixLength) {
      yield buffer.subarray(0, length + prefixLength)

      buffer = buffer.subarray(length + prefixLength, buffer.byteLength)
      if (buffer.length < prefixLength) {
        length = undefined
      } else {
        length = new DataView(buffer.buffer).getUint32(buffer.byteOffset)
      }
    }
  }
}
