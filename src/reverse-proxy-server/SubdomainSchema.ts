import ty from "@xieyuheng/ty"
import { DataSchema } from "../data"

export const SubdomainSchema = ty.intersection(
  DataSchema,
  ty.object({
    usernames: ty.array(ty.string()),
  }),
)
