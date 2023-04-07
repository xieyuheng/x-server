import { expect, test } from "vitest"
import * as Db from "../../db"
import { Unauthorized } from "../../errors/Unauthorized"
import { randomHexString } from "../../utils/randomHexString"
import { prepareTestDb } from "./prepareTestDb"

test("db-data-create-unauthorized", async ({ meta }) => {
  const { db } = await prepareTestDb(meta)

  await expect(
    Db.dataCreate(db, `../users/${randomHexString(10)}`, {
      username: "xieyuheng",
      name: "Xie Yuheng",
    }),
  ).rejects.toThrowError(Unauthorized)
})
