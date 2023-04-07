import { expect, test } from "vitest"
import * as Db from "../../db"
import { Unauthorized } from "../../errors/Unauthorized"
import { prepareTestDb } from "./prepareTestDb"

test("db-directory-delete-unauthorized", async ({ meta }) => {
  const { db } = await prepareTestDb(meta)

  await expect(Db.directoryDelete(db, "..")).rejects.toThrowError(Unauthorized)
})
