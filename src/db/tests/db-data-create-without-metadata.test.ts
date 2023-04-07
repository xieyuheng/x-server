import { Buffer } from "node:buffer"
import { expect, test } from "vitest"
import * as Db from "../../db"
import { prepareTestDb } from "./prepareTestDb"

test("db-data-create-without-metadata", async ({ meta }) => {
  const { db } = await prepareTestDb(meta)

  await Db.fileCreate(
    db,
    "users/xieyuheng/index.json",
    Buffer.from(
      JSON.stringify({
        username: "xieyuheng",
        name: "Xie Yuheng",
      }),
    ),
  )

  const gotted = await Db.dataGetOrFail(db, "users/xieyuheng")

  expect(gotted.username).toEqual("xieyuheng")
  expect(gotted.name).toEqual("Xie Yuheng")
  expect(gotted["@path"]).toEqual("users/xieyuheng")

  expect(typeof gotted["@revision"]).toEqual("string")
  expect(typeof gotted["@createdAt"]).toEqual("number")
  expect(typeof gotted["@updatedAt"]).toEqual("number")
})
