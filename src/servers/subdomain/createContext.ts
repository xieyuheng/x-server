import { resolve } from "node:path"
import { pathIsDirectory } from "../../utils/node/pathIsDirectory"
import { WebsiteConfig } from "../../website/WebsiteConfig"
import { Context } from "./Context"

type ContextOptions = {
  path: string
  rootConfig: WebsiteConfig
}

export async function createContext(options: ContextOptions): Promise<Context> {
  const { path, rootConfig } = options

  const hostname = rootConfig?.server?.hostname
  if (hostname === undefined) {
    throw new Error(
      `[subdomain/createContext] I expect server.hostname to be given.`,
    )
  }

  if (await pathIsDirectory(path)) {
    return {
      domain: hostname,
      directory: resolve(path),
      rootConfig,
    }
  }

  throw new Error(
    `[subdomain/createContext] I expect path to be a directory: ${path}`,
  )
}
