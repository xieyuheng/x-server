import { logJson } from "./logJson"
import type { LogOptions } from "./LogOptions"
import { logPretter } from "./logPretter"
import { logPretterLine } from "./logPretterLine"

let logger: string = "prettier-line"

export function log(options: LogOptions): void {
  if (logger === "json") {
    logJson(options)
  } else if (logger === "silent") {
    //
  } else if (logger === "prettier") {
    logPretter(options)
  } else if (logger === "prettier-line") {
    logPretterLine(options)
  }
}

export function changeLogger(loggerName: string): void {
  logger = loggerName
}
