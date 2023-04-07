import { readCsv } from "../utils/node/readCsv"
import type { Data } from "./Data"
import { randomRevision } from "./randomRevision"

export async function importDataArrayFromCsv(
  file: string,
  options: {
    directory: string
    primaryKey: string
  },
): Promise<Array<Data>> {
  const inputs = await readCsv(file)

  const results = inputs.map<Data>((input) => {
    const path = `${options.directory}/${input[options.primaryKey]}`

    if (typeof path !== "string") {
      throw new Error(
        [
          `[importDataArrayFromCsv] export path string undefined primaryKey`,
          `  primaryKey: ${options.primaryKey}`,
          `  path: ${path}`,
          `  input: ${JSON.stringify(input)}`,
        ].join("\n"),
      )
    }

    return {
      ...input,
      "@path": path,
      "@revision": randomRevision(),
      "@createdAt": Date.now(),
      "@updatedAt": Date.now(),
    }
  })

  return results
}
