import { Schema, ty } from "@xieyuheng/ty"
import { LoggerOptions, LoggerOptionsSchema } from "../server/LoggerOptions"
import { ServerOptions, ServerOptionsSchema } from "../server/ServerOptions"

export type WebsiteConfig = {
  server?: ServerOptions
  logger?: LoggerOptions
  cors?: boolean
  redirectNotFoundTo?: string
  cacheControlPatterns?: Record<string, string>
}

export const WebsiteConfigSchema: Schema<WebsiteConfig> = ty.object({
  server: ty.optional(ServerOptionsSchema),
  logger: ty.optional(LoggerOptionsSchema),
  cors: ty.optional(ty.boolean()),
  redirectNotFoundTo: ty.optional(ty.string()),
  cacheControlPatterns: ty.optional(ty.dict(ty.string())),
})
