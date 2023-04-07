import type { Buffer } from "node:buffer"
import { promisify } from "node:util"
import Zlib from "node:zlib"

const brotliCompress = promisify(Zlib.brotliCompress)
const gzip = promisify(Zlib.gzip)

export async function compress(
  compressionMethod: string | undefined,
  buffer: Buffer,
): Promise<Buffer> {
  if (compressionMethod === "br") {
    return await brotliCompress(buffer)
  }

  if (compressionMethod === "gzip") {
    return await gzip(buffer)
  }

  return buffer
}
