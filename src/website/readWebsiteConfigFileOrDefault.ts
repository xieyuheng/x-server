import { isErrnoException } from "../utils/node/isErrnoException"
import { WebsiteConfig } from "./WebsiteConfig"
import { emptyWebsiteConfig } from "./emptyWebsiteConfig"
import { readWebsiteConfigFile } from "./readWebsiteConfigFile"

export async function readWebsiteConfigFileOrDefault(
  file: string,
): Promise<WebsiteConfig> {
  try {
    return await readWebsiteConfigFile(file)
  } catch (error) {
    if (isErrnoException(error) && error.code === "ENOENT") {
      return emptyWebsiteConfig()
    }

    throw error
  }
}
