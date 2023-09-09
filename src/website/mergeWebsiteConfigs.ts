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

  return {
    ...left,
    ...right,
    cacheControlPatterns,
  }
}
