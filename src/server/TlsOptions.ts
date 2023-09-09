import { Schema, ty } from "@xieyuheng/ty"

export type TlsOptions = {
  cert: string
  key: string
}

export const TlsOptionsSchema: Schema<TlsOptions> = ty.object({
  cert: ty.string(),
  key: ty.string(),
})
