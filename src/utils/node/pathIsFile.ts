import fs from "node:fs"
import { isErrnoException } from "../../utils/node/isErrnoException"

export async function pathIsFile(path: string): Promise<boolean> {
  try {
    const stats = await fs.promises.stat(path)
    return stats.isFile()
  } catch (error) {
    if (isErrnoException(error) && error.code === "ENOENT") {
      return false
    }

    throw error
  }
}
