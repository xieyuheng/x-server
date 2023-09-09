import { WebsiteConfig } from "./WebsiteConfig"

export function websiteConfigFromCommandLineOptions(options: {
  cors?: boolean
  "rewrite-not-found-to"?: string
  "cache-control-pattern"?: string | Array<string>
  logger?: string
}): WebsiteConfig {
  const cacheControlPatterns = createCacheControlPatterns(
    options["cache-control-pattern"],
  )

  return {
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
