import fs from "node:fs"

export async function findSubdomain(
  directory: string,
  hostname: string,
): Promise<string | undefined> {
  try {
    const file = `${directory}/.domain-map/${hostname}/subdomain`
    const text = await fs.promises.readFile(file, "utf-8")
    return text.trim()
  } catch (_error) {
    return undefined
  }
}
