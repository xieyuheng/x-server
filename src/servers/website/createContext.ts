import { resolve } from "node:path"
import { pathIsDirectory } from "../../utils/node/pathIsDirectory"
import { WebsiteConfig } from "../../website/WebsiteConfig"
import { Context } from "./Context"

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
