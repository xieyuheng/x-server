import { Schema, ty } from "@xieyuheng/ty"
import { LoggerOptions, LoggerOptionsSchema } from "./LoggerOptions"
import { TlsOptions, TlsOptionsSchema } from "./TlsOptions"

export type ServerOptions = {
  hostname?: string
  port?: number
  startingPort?: number
  tls?: TlsOptions
  logger?: LoggerOptions
}

export const ServerOptionsSchema: Schema<ServerOptions> = ty.object({
  hostname: ty.optional(ty.string()),
  port: ty.optional(ty.number()),
  startingPort: ty.optional(ty.number()),
  tls: ty.optional(TlsOptionsSchema),
  logger: ty.optional(LoggerOptionsSchema),
})
