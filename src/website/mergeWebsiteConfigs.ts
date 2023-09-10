import { objectRemoveUndefined } from "../utils/objectRemoveUndefined"
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
    ...objectRemoveUndefined(right.cacheControlPatterns || {}),
  } as Record<string, string>

  const server = {
    ...left.server,
    ...objectRemoveUndefined(right.server || {}),
  }

  return {
    ...left,
    ...(objectRemoveUndefined(right) as WebsiteConfig),
    server,
    cacheControlPatterns,
  }
}
