export function isValidTokenName(tokenName: string): boolean {
  return !tokenName.includes(".") && !tokenName.includes("/")
}
