import { expect, test } from "vitest"
import * as Db from ".."
import { randomHexString } from "../../utils/randomHexString"
import { prepareTestDb } from "./prepareTestDb"

test("db-data-delete", async ({ meta }) => {
  const { db } = await prepareTestDb(meta)

  const created = await Db.dataCreate(db, `users/${randomHexString(10)}`, {
    username: "xieyuheng",
    name: "Xie Yuheng",
  })

  expect(await Db.dataGet(db, created["@path"])).toEqual(created)

  await Db.dataDelete(db, created["@path"], created)

  expect(await Db.dataGet(db, created["@path"])).toEqual(undefined)
})
