import { Schema, ty } from "@xieyuheng/ty"
import type { LogOptions } from "./LogOptions"
import { logJson } from "./logJson"
import { logPretty } from "./logPretty"
import { logPrettyLine } from "./logPrettyLine"

export type LoggerName = "json" | "silent" | "pretty" | "pretty-line"

export const LoggerNameSchema: Schema<LoggerName> = ty.union(
  ty.const("json"),
  ty.union(
    ty.const("silent"),
    ty.union(ty.const("pretty"), ty.const("pretty-line")),
  ),
)

let globalLoggerName: LoggerName = "pretty-line"

export function log(options: LogOptions): void {
  if (globalLoggerName === "json") {
    logJson(options)
  } else if (globalLoggerName === "silent") {
  } else if (globalLoggerName === "pretty") {
    logPretty(options)
  } else if (globalLoggerName === "pretty-line") {
    logPrettyLine(options)
  }
}

export function changeLogger(loggerName: LoggerName): void {
  globalLoggerName = loggerName
}
