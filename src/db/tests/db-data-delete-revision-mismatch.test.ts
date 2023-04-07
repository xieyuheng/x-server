import { expect, test } from "vitest"
import * as Db from ".."
import { randomRevision } from "../../data"
import { RevisionMismatch } from "../../errors/RevisionMismatch"
import { prepareTestDb } from "./prepareTestDb"

test("db-data-delete-revision-mismatch", async ({ meta }) => {
  const { db } = await prepareTestDb(meta)

  await Db.dataCreate(db, "users/xieyuheng", {
    username: "xieyuheng",
    name: "Xie Yuheng",
  })

  await expect(
    Db.dataDelete(db, "users/xieyuheng", {
      "@revision": randomRevision(),
      name: "谢宇恒",
    }),
  ).rejects.toThrowError(RevisionMismatch)
})
