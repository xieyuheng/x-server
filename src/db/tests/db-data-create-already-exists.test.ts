import { expect, test } from "vitest"
import * as Db from ".."
import { AlreadyExists } from "../../errors/AlreadyExists"
import { randomHexString } from "../../utils/randomHexString"
import { prepareTestDb } from "./prepareTestDb"

test("db-data-create-already-exists", async ({ meta }) => {
  const { db } = await prepareTestDb(meta)

  const created = await Db.dataCreate(db, `users/${randomHexString(10)}`, {
    username: "xieyuheng",
    name: "Xie Yuheng",
  })

  expect(await Db.dataGet(db, created["@path"])).toEqual(created)

  await expect(
    Db.dataCreate(db, created["@path"], {
      username: "xieyuheng",
      name: "Xie Yuheng",
    }),
  ).rejects.toThrowError(AlreadyExists)
})
