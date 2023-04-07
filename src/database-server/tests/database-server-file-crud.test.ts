import { expect, test } from "vitest"
import { responseHeaders } from "../../utils/responseHeaders"
import { prepareTestServer } from "./prepareTestServer"

test("database-server-file-crud", async ({ meta }) => {
  const { url, authorization } = await prepareTestServer(meta)

  await fetch(new URL(`users/xieyuheng/human.txt?kind=file`, url), {
    method: "POST",
    headers: {
      authorization,
      // NOTE "content-type" does not matter, file extension matters.
      // "content-type": "text/plain",
    },
    body: new TextEncoder().encode("Hello, I am Xie Yuheng."),
  })

  {
    const response = await fetch(
      new URL(`users/xieyuheng/human.txt?kind=file`, url),
      {
        method: "GET",
        headers: {
          authorization,
        },
      },
    )

    const headers = responseHeaders(response)
    expect(headers["content-type"]).toEqual("text/plain")
    expect(await response.text()).toEqual("Hello, I am Xie Yuheng.")
  }

  {
    // NOTE use `response.arrayBuffer`.

    const response = await fetch(
      new URL(`users/xieyuheng/human.txt?kind=file`, url),
      {
        method: "GET",
        headers: {
          authorization,
        },
      },
    )

    const headers = responseHeaders(response)
    expect(headers["content-type"]).toEqual("text/plain")
    expect(new Uint8Array(await response.arrayBuffer())).toEqual(
      new TextEncoder().encode("Hello, I am Xie Yuheng."),
    )
  }

  {
    // NOTE `kind=file` is optional.

    const response = await fetch(new URL(`users/xieyuheng/human.txt`, url), {
      method: "GET",
      headers: {
        authorization,
      },
    })

    const headers = responseHeaders(response)
    expect(headers["content-type"]).toEqual("text/plain")
    expect(await response.text()).toEqual("Hello, I am Xie Yuheng.")
  }

  {
    // NOTE Post to existing file is not ok.

    const response = await fetch(
      new URL(`users/xieyuheng/human.txt?kind=file`, url),
      {
        method: "POST",
        headers: {
          authorization,
        },
        body: new TextEncoder().encode("Hello, I am Xie Yuheng from China."),
      },
    )

    expect(response.ok).toEqual(false)
    expect(response.status).toEqual(403)
  }

  await fetch(new URL(`users/xieyuheng/human.txt?kind=file`, url), {
    method: "PUT",
    headers: {
      authorization,
    },
    body: new TextEncoder().encode("Hello, I am Xie Yuheng from China."),
  })

  {
    const response = await fetch(
      new URL(`users/xieyuheng/human.txt?kind=file`, url),
      {
        method: "GET",
        headers: {
          authorization,
        },
      },
    )

    const headers = responseHeaders(response)
    expect(headers["content-type"]).toEqual("text/plain")
    expect(await response.text()).toEqual("Hello, I am Xie Yuheng from China.")
  }

  await fetch(new URL(`users/xieyuheng/human.txt?kind=file`, url), {
    method: "DELETE",
    headers: {
      authorization,
    },
  })

  {
    const response = await fetch(
      new URL(`users/xieyuheng/human.txt?kind=file`, url),
      {
        method: "GET",
        headers: {
          authorization,
        },
      },
    )

    expect(response.status).toEqual(404)
  }

  {
    // NOTE `kind=file` is optional.

    const response = await fetch(new URL(`users/xieyuheng/human.txt`, url), {
      method: "GET",
      headers: {
        authorization,
      },
    })

    expect(response.status).toEqual(404)
  }
})
