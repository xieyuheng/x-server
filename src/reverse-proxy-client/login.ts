import { formatAuthorizationHeader } from "../utils/formatAuthorizationHeader"
import { log } from "../utils/log"
import { loggedInPatch } from "./loggedInPatch"
import { tokenPatch } from "./tokenPatch"

type Options = {
  url: URL
  username: string
  password: string
}

export async function login(options: Options): Promise<void> {
  const who = "reverse-proxy-client/login"

  const { url, username, password } = options

  const response = await fetch(
    new URL(`/users/${username}?kind=password-login`, url),
    {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        password,
      }),
    },
  )

  if (response.ok) {
    const token = await response.json()

    const urls = await fetchAvailableURLs(url, token, username)
    if (urls === undefined) {
      log({
        who,
        kind: "Error",
        message: `fail to fetchAvailableURLs`,
      })

      return
    }

    await tokenPatch(urls, { token, username })

    log({
      who,
      message: `token saved`,
      availableURLs: urls,
    })

    await loggedInPatch(url.href, { username })

    log({
      who,
      message: `logged url saved`,
      url: url.href,
      username,
    })
  } else {
    log({
      who,
      kind: "Error",
      status: {
        code: response.status,
        message: response.statusText,
      },
    })
  }
}

async function fetchAvailableURLs(
  url: URL,
  token: string,
  username: string,
): Promise<Array<string> | undefined> {
  const who = "fetchAvailableURLs"

  const response = await fetch(new URL(`/?kind=info`, url), {
    method: "GET",
  })

  if (!response.ok) {
    log({
      who,
      message: `fail to fetch /?kind=info`,
      url,
      status: {
        code: response.status,
        message: response.statusText,
      },
    })

    return
  }

  const { availablePorts } = await response.json()

  {
    const response = await fetch(new URL(`/users/${username}`, url), {
      method: "GET",
      headers: {
        authorization: formatAuthorizationHeader(token),
      },
    })

    if (!response.ok) {
      log({
        who,
        message: `fail to fetch /users/${username}`,
        url,
        status: {
          code: response.status,
          message: response.statusText,
        },
      })

      return
    }

    const { subdomains } = await response.json()

    return subdomains.flatMap((subdomain: string) =>
      availablePorts.map(
        (port: number) =>
          `${url.protocol}//${subdomain}.${url.hostname}:${port}`,
      ),
    )
  }
}
