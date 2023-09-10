import { resolve } from "node:path"
import { ServerOptions } from "../../server/ServerOptions"
import { pathIsDirectory } from "../../utils/node/pathIsDirectory"

export type Context = {
  directory: string
  server: ServerOptions
}

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

  throw new Error(`[createContext] path is a directory: ${path}`)
}
