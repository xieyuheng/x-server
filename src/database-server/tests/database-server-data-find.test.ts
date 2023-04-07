import qs from "qs"
import { expect, test } from "vitest"
import { prepareTestServer } from "./prepareTestServer"

test("database-server-data-find", async ({ meta }) => {
  const { url, authorization } = await prepareTestServer(meta)

  const array = [
    { "@path": "users/0", country: "China" },
    { "@path": "users/1" },
    { "@path": "users/2", country: "China" },
    { "@path": "users/3" },
    { "@path": "users/4", country: "China" },
    { "@path": "users/5" },
    { "@path": "users/6", country: "China" },
    { "@path": "users/7" },
    { "@path": "users/8", country: "China" },
    { "@path": "users/9" },
  ]

  for (const data of array) {
    await fetch(new URL(`${data["@path"]}`, url), {
      method: "POST",
      headers: {
        authorization,
        "content-type": "application/json",
      },
      body: JSON.stringify(data),
    })
  }

  {
    const query = qs.stringify({
      page: 1,
      size: 3,
      properties: {
        country: "China",
      },
    })

    const response = await fetch(
      new URL(`users?kind=data-find&${query}`, url),
      {
        method: "GET",
        headers: {
          authorization,
        },
      },
    )

    expect((await response.json()).length).toEqual(3)
  }

  {
    const query = qs.stringify({
      page: 2,
      size: 3,
      properties: {
        country: "China",
      },
    })

    const response = await fetch(
      new URL(`users?kind=data-find&${query}`, url),
      {
        method: "GET",
        headers: {
          authorization,
        },
      },
    )

    expect((await response.json()).length).toEqual(2)
  }
})
