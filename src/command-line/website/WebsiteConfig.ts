import { Schema, ty } from "@xieyuheng/ty"

export type WebsiteConfig = {
  cors?: boolean
  rewriteNotFoundTo?: string
  cacheControlPattern?: Record<string, string>
  logger?: string
}

export const WebsiteConfigSchema: Schema<WebsiteConfig> = ty.object({
  cors: ty.optional(ty.boolean()),
  rewriteNotFoundTo: ty.optional(ty.string()),
  cacheControlPattern: ty.optional(ty.dict(ty.string())),
  logger: ty.optional(ty.string()),
})
