import { expect, test } from "vitest"
import type { PathEntry } from "../../path-entry"
import { prepareTestServer } from "./prepareTestServer"

test("database-server-directory-get-nested", async ({ meta }) => {
  const { url, authorization } = await prepareTestServer(meta)

  {
    const response = await fetch(new URL(`projects/1?kind=directory`, url), {
      method: "GET",
      headers: {
        authorization,
      },
    })
    const results = await response.json()
    expect(results.length).toEqual(0)
  }

  await fetch(new URL(`projects/1/users/1`, url), {
    method: "POST",
    headers: {
      authorization,
      "content-type": "application/json",
    },
    body: JSON.stringify({}),
  })

  {
    const response = await fetch(new URL(`projects/1?kind=directory`, url), {
      method: "GET",
      headers: {
        authorization,
      },
    })
    const results = await response.json()
    expect(results.length).toEqual(1)
    expect(
      Boolean(
        results.find(({ path }: PathEntry) => path === "projects/1/users"),
      ),
    ).toEqual(true)
    expect(
      Boolean(
        results.find(({ path }: PathEntry) => path === "projects/1/posts"),
      ),
    ).toEqual(false)
  }

  await fetch(new URL(`projects/1/posts/1`, url), {
    method: "POST",
    headers: {
      authorization,
      "content-type": "application/json",
    },
    body: JSON.stringify({}),
  })

  {
    const response = await fetch(new URL(`projects/1?kind=directory`, url), {
      method: "GET",
      headers: {
        authorization,
      },
    })
    const results = await response.json()
    expect(results.length).toEqual(2)
    expect(
      Boolean(
        results.find(({ path }: PathEntry) => path === "projects/1/users"),
      ),
    ).toEqual(true)
    expect(
      Boolean(
        results.find(({ path }: PathEntry) => path === "projects/1/posts"),
      ),
    ).toEqual(true)
  }
})
