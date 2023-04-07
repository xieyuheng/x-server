import { Buffer } from "node:buffer"
import type Http from "node:http"

export function requestBuffer(request: Http.IncomingMessage): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Array<Buffer> = []

    request.on("data", (chunk: Buffer) => {
      chunks.push(chunk)
    })

    request.on("end", () => {
      resolve(Buffer.concat(chunks))
    })

    request.on("error", (error) => {
      reject(error)
    })
  })
}
