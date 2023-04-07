import { parseFile } from "fast-csv"
import type { JsonObject } from "../Json"

export async function readCsv(file: string): Promise<Array<JsonObject>> {
  return new Promise((resolve, reject) => {
    const results: Array<any> = []
    const stream = parseFile(file, { headers: true })

    stream.on("data", (result) => {
      results.push(result)
    })

    stream.on("end", () => {
      resolve(results)
    })

    stream.on("error", (error) => {
      reject(error)
    })
  })
}
