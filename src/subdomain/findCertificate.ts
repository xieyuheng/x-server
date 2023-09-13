import fs from "node:fs"

export async function findCertificate(
  directory: string,
  hostname: string,
): Promise<{ cert: string; key: string } | undefined> {
  try {
    const certFile = `${directory}/.domain-map/${hostname}/cert`
    const keyFile = `${directory}/.domain-map/${hostname}/key`
    return {
      cert: await fs.promises.readFile(certFile, "utf-8"),
      key: await fs.promises.readFile(keyFile, "utf-8"),
    }
  } catch (_error) {
    return undefined
  }
}
