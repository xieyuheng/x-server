import { resolve } from "node:path"
import { ServerOptions } from "../../server/ServerOptions"
import { pathIsDirectory } from "../../utils/node/pathIsDirectory"
import { Context } from "./Context"

type ContextOptions = {
  path: string
  server: ServerOptions
}

export async function createContext(options: ContextOptions): Promise<Context> {
  const { path, server } = options

  if (await pathIsDirectory(path)) {
    return {
      directory: resolve(path),
      server,
    }
  }

  throw new Error(
    `[subdomain/createContext] I expect path to be a directory: ${path}`,
  )
}
