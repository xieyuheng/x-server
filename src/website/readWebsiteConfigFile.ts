import fs from "node:fs"
import { WebsiteConfig } from "./WebsiteConfig"
import { createWebsiteConfig } from "./createWebsiteConfig"

export async function readWebsiteConfigFile(
  file: string,
): Promise<WebsiteConfig> {
  const text = await fs.promises.readFile(file, "utf-8")
  const json = JSON.parse(text)
  return createWebsiteConfig(json)
}
