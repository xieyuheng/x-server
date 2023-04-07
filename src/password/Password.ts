import ty, { Schema } from "@xieyuheng/ty"
import { Data, DataSchema } from "../data"
import { TokenPermission, TokenPermissionSchema } from "../token"

export type Password = Data & {
  memo: string
  hash: string
  permissions: Array<TokenPermission>
}

export const PasswordSchema: Schema<Password> = ty.intersection(
  DataSchema,
  ty.object({
    memo: ty.string(),
    hash: ty.string(),
    permissions: ty.array(TokenPermissionSchema),
  }),
)
