import { Schema, ty } from "@xieyuheng/ty"

export type WebsiteConfig = {
  cors?: boolean
  rewriteNotFoundTo?: string
  cacheControlPatterns: Record<string, string>
  logger?: string
}

export const WebsiteConfigSchema: Schema<WebsiteConfig> = ty.object({
  cors: ty.optional(ty.boolean()),
  rewriteNotFoundTo: ty.optional(ty.string()),
  cacheControlPatterns: ty.dict(ty.string()),
  logger: ty.optional(ty.string()),
})
