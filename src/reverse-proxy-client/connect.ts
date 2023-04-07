import { createWorker } from "../reverse-proxy/Worker"
import { formatAuthorizationHeader } from "../utils/formatAuthorizationHeader"
import { log } from "../utils/log"
import { tokenGet } from "./tokenGet"

type Options = {
  publicURL: URL
  local: { hostname: string; port: number }
}

function parseArgURL(url: URL): { serverURL: URL; subdomain: string } {
  const [subdomain, ...hostnameParts] = url.hostname.split(".")
  const hostname = hostnameParts.join(".")
  const serverURL = new URL(`${url.protocol}//${hostname}:${url.port}`)
  return { serverURL, subdomain }
}

export async function connect(options: Options): Promise<boolean> {
  const who = "reverse-proxy-client/connect"

  const { publicURL, local } = options
  const { serverURL, subdomain } = parseArgURL(publicURL)

  const value = await tokenGet(publicURL.href)

  if (value === undefined) {
    log({
      kind: "Error",
      who,
      message: `no token for url`,
      url: publicURL,
    })

    return false
  }

  const response = await fetch(
    `${serverURL.protocol}//${serverURL.host}?kind=channel`,
    {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: formatAuthorizationHeader(value.token),
      },
      body: JSON.stringify({
        subdomain,
        username: value.username,
      }),
    },
  )

  if (!response.ok) {
    log({
      kind: "Error",
      message: `fail to create channel`,
      host: serverURL.host,
      who,
      status: {
        code: response.status,
        message: response.statusText,
      },
    })

    return false
  }

  const ticket = await response.json()

  log({ who, ticket })

  const worker = await createWorker({
    ticket,
    subdomain,
    hostname: serverURL.hostname,
    local,
  })

  return true
}
