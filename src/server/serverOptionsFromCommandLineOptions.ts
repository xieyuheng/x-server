import { ServerOptions } from "./ServerOptions"

export function serverOptionsFromCommandLineOptions(options: {
  hostname?: string
  port?: number
  "tls-cert"?: string
  "tls-key"?: string
}): ServerOptions {
  const tls =
    options["tls-cert"] && options["tls-key"]
      ? {
          cert: options["tls-cert"],
          key: options["tls-key"],
        }
      : undefined

  return {
    hostname: options["hostname"],
    port: options["port"],
    tls,
  }
}
