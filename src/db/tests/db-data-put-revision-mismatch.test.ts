import { expect, test } from "vitest"
import { randomRevision } from "../../data"
import * as Db from "../../db"
import { RevisionMismatch } from "../../errors/RevisionMismatch"
import { prepareTestDb } from "./prepareTestDb"

test("db-data-put-revision-mismatch", async ({ meta }) => {
  const { db } = await prepareTestDb(meta)

  const created = await Db.dataCreate(db, "users/xieyuheng", {
    username: "xieyuheng",
    name: "Xie Yuheng",
  })

  await expect(
    Db.dataPut(db, created["@path"], {
      ...created,
      "@revision": randomRevision(),
    }),
  ).rejects.toThrowError(RevisionMismatch)
})
