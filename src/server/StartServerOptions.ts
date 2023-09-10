import { Schema, ty } from "@xieyuheng/ty"
import { TlsOptions, TlsOptionsSchema } from "./TlsOptions"

export type StartServerOptions = {
  hostname?: string
  port?: number
  startingPort?: number
  tls?: TlsOptions
}

export const StartServerOptionsSchema: Schema<StartServerOptions> = ty.object({
  hostname: ty.optional(ty.string()),
  port: ty.optional(ty.number()),
  startingPort: ty.optional(ty.number()),
  tls: ty.optional(TlsOptionsSchema),
})
