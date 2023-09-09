import { WebsiteConfig } from "./WebsiteConfig"

export function emptyWebsiteConfig(): WebsiteConfig {
  return {
    cacheControlPatterns: {},
  }
}
