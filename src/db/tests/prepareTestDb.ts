import { resolve } from "node:path"
import { createDatabase } from "../../database"
import { formatDateTime } from "../../utils/formatDate"
import { randomHexString } from "../../utils/randomHexString"
import { slug } from "../../utils/slug"

const PREFIX = resolve(__filename, "../../../../tmp/databases/")

export async function prepareTestDb(options: { name: string }) {
  const file = slug(
    `${formatDateTime(Date.now())}-${randomHexString(4)}-${options.name}`,
  )

  const path = resolve(PREFIX, file)

  const db = await createDatabase({ path })

  return { db }
}
