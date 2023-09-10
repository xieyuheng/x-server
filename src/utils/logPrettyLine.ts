import { colors } from "./colors"
import { formatTime } from "./formatDate"
import type { LogOptions } from "./LogOptions"

export function logPrettyLine(options: LogOptions): void {
  const { kind, who, elapse, message } = options

  let s = ""

  s += formatNow() + " "

  if (kind === "Error") {
    s += colors.red(formatWho(who)) + " "
  } else if (kind === "Warning") {
    s += colors.magenta(formatWho(who)) + " "
  } else {
    s += colors.blue(formatWho(who)) + " "
  }

  if (message) s += colors.bold(`${message} `)
  if (elapse !== undefined) s += formatElapse(elapse)

  const properties = Object.fromEntries(
    Object.entries(options).filter(
      ([key, value]) =>
        value !== undefined &&
        !["who", "kind", "message", "elapse"].includes(key),
    ),
  )

  if (Object.keys(properties).length > 0) {
    s += "-- "
    s += JSON.stringify(properties)
  }

  console.log(s.trim())
}

function formatWho(who: string): string {
  return colors.bold(`[${who}]`)
}

function formatNow(): string {
  const time = formatTime(new Date(), { withMilliseconds: true })
  return colors.yellow(`${time}`)
}

function formatElapse(elapse: number): string {
  return colors.yellow(`<${elapse}ms>`)
}
