import type { LogOptions } from "./LogOptions"

export function logJson(options: LogOptions): void {
  console.dir(options, { depth: null })
}
