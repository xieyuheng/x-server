import { WebsiteConfig } from "./WebsiteConfig"
import { emptyWebsiteConfig } from "./emptyWebsiteConfig"

export function mergeWebsiteConfigs(
  configs: Array<WebsiteConfig>,
): WebsiteConfig {
  let result = emptyWebsiteConfig()
  for (const config of configs) {
    result = mergeTwoWebsiteConfigs(result, config)
  }

  return result
}

function mergeTwoWebsiteConfigs(
  left: WebsiteConfig,
  right: WebsiteConfig,
): WebsiteConfig {
  const cacheControlPatterns = {
    ...left.cacheControlPatterns,
    ...right.cacheControlPatterns,
  }

  right = Object.fromEntries(
    Object.entries(right).filter(([key, value]) => value !== undefined),
  ) as WebsiteConfig

  return {
    ...left,
    ...right,
    cacheControlPatterns,
  }
}
