import { resolve } from "node:path"
import { pathIsDirectory } from "../../utils/node/pathIsDirectory"
import { WebsiteConfig } from "../../website/WebsiteConfig"

export type Context = {
  directory: string
  config: WebsiteConfig
}

type ContextOptions = {
  path: string
  config: WebsiteConfig
}

export async function createContext(options: ContextOptions): Promise<Context> {
  const { path, config } = options

  if (await pathIsDirectory(path)) {
    return {
      directory: resolve(path),
      config,
    }
  }

  throw new Error(`[createContext] path is a directory: ${path}`)
}
