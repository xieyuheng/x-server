export function objectRemoveUndefined(object: JsonObject): JsonObject {
  return Object.fromEntries(
    Object.entries(object).filter(([key, value]) => value !== undefined),
  )
}
