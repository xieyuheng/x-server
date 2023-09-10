import { Schema, ty } from "@xieyuheng/ty"
import {
  StartServerOptions,
  StartServerOptionsSchema,
} from "../server/StartServerOptions"

export type WebsiteConfig = StartServerOptions & {
  cors?: boolean
  rewriteNotFoundTo?: string
  cacheControlPatterns: Record<string, string>
  logger?: string
}

export const WebsiteConfigSchema: Schema<WebsiteConfig> = ty.intersection(
  StartServerOptionsSchema,
  ty.object({
    cors: ty.optional(ty.boolean()),
    rewriteNotFoundTo: ty.optional(ty.string()),
    cacheControlPatterns: ty.dict(ty.string()),
    logger: ty.optional(ty.string()),
  }),
)
