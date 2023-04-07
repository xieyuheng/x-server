import { expect, test } from "vitest"
import * as Db from ".."
import { arrayFromAsyncIterable } from "../../utils/arrayFromAsyncIterable"
import { prepareTestDb } from "./prepareTestDb"

test("db-data-find-all", async ({ meta }) => {
  const { db } = await prepareTestDb(meta)

  await Db.dataCreate(db, "users/0", { country: "China" })
  await Db.dataCreate(db, "users/1", {})
  await Db.dataCreate(db, "users/2", { country: "China" })

  expect(
    (
      await arrayFromAsyncIterable(
        Db.dataFindAll(db, "users", {
          properties: { country: "China" },
        }),
      )
    ).length,
  ).toEqual(2)

  expect(
    (
      await arrayFromAsyncIterable(
        Db.dataFindAll(db, "users", {
          properties: {},
        }),
      )
    ).length,
  ).toEqual(3)
})
