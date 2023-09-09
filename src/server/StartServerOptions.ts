import { TlsOptions } from "./TlsOptions"

export type StartServerOptions = {
  hostname?: string
  port?: number
  startingPort?: number
  tls?: TlsOptions
}

// export const StartServerOptionsSchema: Schema<StartServerOptions> =
