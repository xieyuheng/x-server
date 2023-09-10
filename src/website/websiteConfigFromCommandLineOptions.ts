import { WebsiteConfig } from "./WebsiteConfig"

export function websiteConfigFromCommandLineOptions(options: {
  hostname?: string
  port?: number
  "tls-cert"?: string
  "tls-key"?: string
  cors?: boolean
  "rewrite-not-found-to"?: string
  "cache-control-pattern"?: string | Array<string>
  logger?: string
}): WebsiteConfig {
  const cacheControlPatterns = createCacheControlPatterns(
    options["cache-control-pattern"],
  )

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
    cors: options["cors"],
    rewriteNotFoundTo: options["rewrite-not-found-to"],
    cacheControlPatterns,
    logger: options["logger"],
  }
}

function createCacheControlPatterns(
  input: undefined | string | Array<string>,
): Record<string, string> {
  if (input === undefined) {
    return {}
  }

  if (typeof input === "string") {
    const [pattern, value] = input.split(":").map((s) => s.trim())
    return Object.fromEntries([[pattern, value]])
  }

  return Object.fromEntries(
    input.map((entry) => entry.split(":").map((s) => s.trim())),
  )
}
