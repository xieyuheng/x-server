import type { Database } from "../database"
import { dataCreate } from "../db/dataCreate"
import type { TokenPermissionRecord } from "../token"
import { randomTokenName } from "../token/randomTokenName"

export async function tokenCreate(
  db: Database,
  options: {
    permissions: TokenPermissionRecord
  },
): Promise<string> {
  const tokenName = randomTokenName()

  await dataCreate(db, `tokens/${tokenName}`, {
    permissions: options.permissions,
  })

  return tokenName
}
