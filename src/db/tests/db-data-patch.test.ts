import { expect, test } from "vitest"
import * as Db from "../../db"
import { prepareTestDb } from "./prepareTestDb"

test("db-data-patch", async ({ meta }) => {
  const { db } = await prepareTestDb(meta)

  const created = await Db.dataCreate(db, "users/xieyuheng", {
    username: "xieyuheng",
    name: "Xie Yuheng",
  })

  expect(await Db.dataGet(db, "users/xieyuheng")).toEqual(created)

  const patched = await Db.dataPatch(db, "users/xieyuheng", {
    "@revision": created["@revision"],
    name: "谢宇恒",
  })

  expect(patched.name).toEqual("谢宇恒")
  expect(await Db.dataGet(db, "users/xieyuheng")).toEqual(patched)

  await Db.dataDelete(db, patched["@path"], patched)

  expect(await Db.dataGet(db, "users/xieyuheng")).toEqual(undefined)
})
