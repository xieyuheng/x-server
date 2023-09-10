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
  const hostname = server.hostname
  if (hostname === undefined) {
    throw new Error(
      `[subdomain/createContext] I expect server.hostname to be given.`,
    )
  }

  if (await pathIsDirectory(path)) {
    return {
      domain: hostname,
      directory: resolve(path),
      server,
    }
  }

  throw new Error(
    `[subdomain/createContext] I expect path to be a directory: ${path}`,
  )
}
