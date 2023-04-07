import fs from "node:fs"

export async function pathExists(path: string): Promise<boolean> {
  try {
    await fs.promises.access(path)
    return true
  } catch (_error) {
    return false
  }
}
