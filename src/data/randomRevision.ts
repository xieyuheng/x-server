import { randomHexString } from "../utils/randomHexString"

export function randomRevision(): string {
  return randomHexString(16)
}
