import { expect, test } from "vitest"
import * as Db from "../../db"
import { prepareTestDb } from "./prepareTestDb"

test("db-data-put", async ({ meta }) => {
  const { db } = await prepareTestDb(meta)

  const created = await Db.dataCreate(db, "users/xieyuheng", {
    username: "xieyuheng",
    name: "Xie Yuheng",
  })

  expect(await Db.dataGet(db, "users/xieyuheng")).toEqual(created)

  const putted = await Db.dataPut(db, created["@path"], {
    ...created,
    username: "xieyuheng",
    name: "谢宇恒",
  })

  expect(await Db.dataGet(db, "users/xieyuheng")).toEqual(putted)

  await Db.dataDelete(db, putted["@path"], putted)

  expect(await Db.dataGet(db, "users/xieyuheng"), undefined).toEqual(undefined)
})
