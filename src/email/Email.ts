import ty, { Schema } from "@xieyuheng/ty"
import { Data, DataSchema } from "../data"

export type Email = Data & {
  address: string
}

export const EmailSchema: Schema<Email> = ty.intersection(
  DataSchema,
  ty.object({
    address: ty.email(),
  }),
)
