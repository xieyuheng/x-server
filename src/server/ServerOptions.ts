import { Schema, ty } from "@xieyuheng/ty"
import { TlsOptions, TlsOptionsSchema } from "./TlsOptions"

export type ServerOptions = {
  hostname?: string
  port?: number
  startingPort?: number
  tls?: TlsOptions
}

export const ServerOptionsSchema: Schema<ServerOptions> = ty.object({
  hostname: ty.optional(ty.string()),
  port: ty.optional(ty.number()),
  startingPort: ty.optional(ty.number()),
  tls: ty.optional(TlsOptionsSchema),
})
