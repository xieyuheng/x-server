import { ServerOptions } from "../../server/ServerOptions"

export type Context = {
  domain: string
  directory: string
  server: ServerOptions
}
