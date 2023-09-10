import { Schema, ty } from "@xieyuheng/ty"

export type LoggerOptions = {
  name: string,
  disableRequestLogging?: boolean
}


export const LoggerOptionsSchema: Schema<LoggerOptions> = ty.object({
  name: ty.string(),
  disableRequestLogging: ty.optional(ty.boolean())
})
