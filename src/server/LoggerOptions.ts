import { Schema, ty } from "@xieyuheng/ty"
import { LoggerName, LoggerNameSchema } from "../utils/log"

export type LoggerOptions = {
  name?: LoggerName
  disableRequestLogging?: boolean
}

export const LoggerOptionsSchema: Schema<LoggerOptions> = ty.object({
  name: ty.optional(LoggerNameSchema),
  disableRequestLogging: ty.optional(ty.boolean()),
})
