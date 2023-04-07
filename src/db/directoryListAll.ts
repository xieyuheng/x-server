import fs from "node:fs"
import { join } from "node:path"
import type { Database } from "../database"
import type { PathEntry } from "../path-entry"
import { isErrnoException } from "../utils/node/isErrnoException"
import { resolvePath } from "./utils/resolvePath"

export async function* directoryListAll(
  db: Database,
  directory: string,
): AsyncIterable<PathEntry> {
  try {
    const dir = await fs.promises.opendir(resolvePath(db, directory), {
      bufferSize: 1024,
    })

    for await (const dirEntry of dir) {
      if (dirEntry.isDirectory()) {
        yield {
          kind: "Directory",
          path: join(directory, dirEntry.name),
        }
      } else if (dirEntry.isFile()) {
        yield {
          kind: "File",
          path: join(directory, dirEntry.name),
        }
      }
    }
  } catch (error) {
    if (!(isErrnoException(error) && error.code === "ENOENT")) {
      throw error
    }
  }
}
