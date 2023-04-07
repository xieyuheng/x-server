import { expect, test } from "vitest"
import * as Db from "../../db"
import type { PathEntry } from "../../path-entry"
import { arrayFromAsyncIterable } from "../../utils/arrayFromAsyncIterable"
import { prepareTestDb } from "./prepareTestDb"

test("db-directory-create", async ({ meta }) => {
  const { db } = await prepareTestDb(meta)

  expect(
    (await arrayFromAsyncIterable(Db.directoryListAll(db, ""))).length,
  ).toEqual(0)

  await Db.directoryCreate(db, "users")

  expect(
    (await arrayFromAsyncIterable(Db.directoryListAll(db, ""))).length,
  ).toEqual(1)
  expect(
    Boolean(
      (await arrayFromAsyncIterable(Db.directoryListAll(db, ""))).find(
        ({ path }: PathEntry) => path === "users",
      ),
    ),
  ).toEqual(true)
})
