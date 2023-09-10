import { WebsiteConfig } from "./WebsiteConfig"
import { Content, readContent } from "./readContent"

export async function readContentWithRewrite(
  directory: string,
  config: WebsiteConfig,
  path: string,
): Promise<Content | undefined> {
  const content = await readContent(directory, path)
  if (content !== undefined) {
    return content
  }

  if (config.rewriteNotFoundTo !== undefined) {
    return await readContent(directory, config.rewriteNotFoundTo)
  }
}
