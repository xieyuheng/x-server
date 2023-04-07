import { expect, test } from "vitest"
import * as Db from ".."
import { arrayFromAsyncIterable } from "../../utils/arrayFromAsyncIterable"
import { prepareTestDb } from "./prepareTestDb"

test("db-data-find", async ({ meta }) => {
  const { db } = await prepareTestDb(meta)

  await Db.dataCreate(db, "users/0", { country: "China" })
  await Db.dataCreate(db, "users/1", {})
  await Db.dataCreate(db, "users/2", { country: "China" })
  await Db.dataCreate(db, "users/3", {})
  await Db.dataCreate(db, "users/4", { country: "China" })
  await Db.dataCreate(db, "users/5", {})
  await Db.dataCreate(db, "users/6", { country: "China" })
  await Db.dataCreate(db, "users/7", {})
  await Db.dataCreate(db, "users/8", { country: "China" })
  await Db.dataCreate(db, "users/9", {})

  expect(
    (
      await arrayFromAsyncIterable(
        Db.dataFind(db, "users", {
          page: 1,
          size: 3,
          properties: { country: "China" },
        }),
      )
    ).length,
  ).toEqual(3)

  expect(
    (
      await arrayFromAsyncIterable(
        Db.dataFind(db, "users", {
          page: 2,
          size: 3,
          properties: { country: "China" },
        }),
      )
    ).length,
  ).toEqual(2)

  expect(
    (
      await arrayFromAsyncIterable(
        Db.dataFind(db, "users", {
          page: 3,
          size: 3,
          properties: { country: "China" },
        }),
      )
    ).length,
  ).toEqual(0)
})
