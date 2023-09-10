import { Schema, ty } from "@xieyuheng/ty"
import { ServerOptions, ServerOptionsSchema } from "../server/ServerOptions"

export type WebsiteConfig = ServerOptions & {
  cors?: boolean
  rewriteNotFoundTo?: string
  cacheControlPatterns: Record<string, string>
}

export const WebsiteConfigSchema: Schema<WebsiteConfig> = ty.intersection(
  ServerOptionsSchema,
  ty.object({
    cors: ty.optional(ty.boolean()),
    rewriteNotFoundTo: ty.optional(ty.string()),
    cacheControlPatterns: ty.dict(ty.string()),
  }),
)
