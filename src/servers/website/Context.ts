import { resolve } from "node:path"
import { pathIsDirectory } from "../../utils/node/pathIsDirectory"
import { WebsiteConfig } from "../../website/WebsiteConfig"

export type Context = {
  directory: string
  config: WebsiteConfig
}
