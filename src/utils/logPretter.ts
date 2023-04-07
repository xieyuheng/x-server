import { colors } from "./colors"
import { formatTime } from "./formatDate"
import { indent } from "./indent"
import type { LogOptions } from "./LogOptions"

export function logPretter(options: LogOptions): void {
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

  if (message) s += `${message}`
  if (elapse !== undefined) s += " " + formatElapse(elapse)

  s += "\n"

  for (const [key, value] of Object.entries(options)) {
    if (!["who", "kind", "message", "elapse"].includes(key)) {
      if (value !== undefined) {
        s += formatProperty(key, value)
        s += "\n"
      }
    }
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

function formatProperty(key: string, value: any): string {
  const k = colors.italic(colors.yellow(key))
  const j = JSON.stringify(value, null, 2)
  const v = indent(j, "  ").trim()
  return `  ${k}: ${v}`
}
