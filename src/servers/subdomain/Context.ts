import { WebsiteConfig } from "../../website/WebsiteConfig"

export type Context = {
  domain: string
  directory: string
  config: WebsiteConfig
}
