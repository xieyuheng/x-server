import { WebsiteConfig, WebsiteConfigSchema } from "./WebsiteConfig"

export function createWebsiteConfig(json: any): WebsiteConfig {
  return WebsiteConfigSchema.validate(json)
}
