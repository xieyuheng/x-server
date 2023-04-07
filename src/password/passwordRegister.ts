import { ty } from "@xieyuheng/ty"
import { join } from "node:path"
import type { Database } from "../database"
import { dataCreate } from "../db/dataCreate"
import { TokenPermission, TokenPermissionSchema } from "../token"
import { passwordHash } from "../utils/node/password"
import { randomHexString } from "../utils/randomHexString"

export type PasswordRegisterOptions = {
  memo: string
  password: string
  permissions: Array<TokenPermission>
}

export const PasswordRegisterOptionsSchema = ty.object({
  memo: ty.string(),
  password: ty.string(),
  permissions: ty.array(TokenPermissionSchema),
})

export async function passwordRegister(
  db: Database,
  directory: string,
  options: PasswordRegisterOptions,
): Promise<void> {
  const id = randomHexString(10)
  await dataCreate(db, join(directory, "passwords", id), {
    hash: await passwordHash(options.password),
    memo: options.memo,
    permissions: options.permissions,
  })
}
