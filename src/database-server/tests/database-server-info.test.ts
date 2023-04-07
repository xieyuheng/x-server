import { expect, test } from "vitest"
import { prepareTestServer } from "./prepareTestServer"

test("database-server-info", async ({ meta }) => {
  const { url, db } = await prepareTestServer(meta)

  db.config = {
    name: "database-server-info",
    description: "Example config",
    authDirectories: {
      users: {
        permissions: ["create", "read", "update", "delete"],
      },
    },
  }

  const info = await (
    await fetch(new URL(`?kind=info`, url), {
      method: "GET",
      headers: {
        "content-type": "application/json",
      },
    })
  ).json()

  expect(info).toEqual({
    db: {
      config: db.config,
    },
  })
})
