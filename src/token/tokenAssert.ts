import { Unauthorized } from "../errors/Unauthorized"
import type { Token, TokenPermission } from "./Token"
import { tokenCheck } from "./tokenCheck"

export function tokenAssert(
  token: Token,
  path: string,
  name: TokenPermission,
): void {
  if (!tokenCheck(token, path, name)) {
    throw new Unauthorized(
      `[tokenAssert] not permitted to ${name} path: ${path}`,
    )
  }
}
