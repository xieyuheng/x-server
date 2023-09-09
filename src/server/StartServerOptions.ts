import { Schema, ty } from "@xieyuheng/ty"
import { TlsOptions, TlsOptionsSchema } from "./TlsOptions"

export type StartServerOptions = {
  hostname?: string
  port?: number
  startingPort?: number
  tls?: TlsOptions
}

export const StartServerOptionsSchema: Schema<StartServerOptions> = ty.object({
  hostname: ty.string(),
  port: ty.number(),
  startingPort: ty.number(),
  tls: TlsOptionsSchema,
})
