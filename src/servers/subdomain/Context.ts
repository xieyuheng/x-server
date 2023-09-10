import { resolve } from "node:path"
import { ServerOptions } from "../../server/ServerOptions"
import { pathIsDirectory } from "../../utils/node/pathIsDirectory"

export type Context = {
  directory: string
  server: ServerOptions
}
