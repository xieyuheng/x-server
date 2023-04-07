import { randomHexString } from "../utils/randomHexString"

export function randomTokenName(): string {
  return randomHexString(16)
}
