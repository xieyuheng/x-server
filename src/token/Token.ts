import ty, { Schema } from "@xieyuheng/ty"
import { Data, DataSchema } from "../data"

export type TokenPermission = "create" | "read" | "update" | "delete"

export type TokenPermissionRecord = Record<string, Array<TokenPermission>>

export type Token = Data & {
  permissions: TokenPermissionRecord
}

export const TokenPermissionSchema: Schema<TokenPermission> = ty.union(
  ty.const("create" as const),
  ty.union(
    ty.const("read" as const),
    ty.union(ty.const("update" as const), ty.const("delete" as const)),
  ),
)

export const TokenSchema: Schema<Token> = ty.intersection(
  DataSchema,
  ty.object({
    permissions: ty.dict(ty.array(TokenPermissionSchema)),
  }),
)
