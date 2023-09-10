import type { LogOptions } from "./LogOptions"
import { logJson } from "./logJson"
import { logPretty } from "./logPretty"
import { logPrettyLine } from "./logPrettyLine"

let logger: string = "pretty-line"

export function log(options: LogOptions): void {
  if (logger === "json") {
    logJson(options)
  } else if (logger === "silent") {
    //
  } else if (logger === "pretty") {
    logPretty(options)
  } else if (logger === "pretty-line") {
    logPrettyLine(options)
  }
}

export function changeLogger(loggerName: string): void {
  logger = loggerName
}
