import { WebsiteConfig, WebsiteConfigSchema } from "./WebsiteConfig"

export function createWebsiteConfig(input: any): WebsiteConfig {
  return WebsiteConfigSchema.validate(input)
}
