import { createRequestListener } from "../../server/createRequestListener"
import { createServer } from "../../server/createServer"
import { log } from "../../utils/log"
import { findPort } from "../../utils/node/findPort"
import { serverListen } from "../../utils/node/serverListen"
import { WebsiteConfig } from "../../website/WebsiteConfig"
import { createContext } from "./createContext"
import { handle } from "./handle"

export async function startServer(
  path: string,
  config: WebsiteConfig,
): Promise<void> {
  const who = "website/startServer"

  const ctx = await createContext({ path, config })

  log({ who, message: "createContext", ctx })

  const listener = createRequestListener({
    ctx,
    handle,
    server: config.server || {},
    logger: config.logger || {},
  })

  const serverOptions = config.server || {}

  const { scheme, server } = await createServer(listener, serverOptions)

  const hostname = serverOptions.hostname || "127.0.0.1"

  const port = Number(
    process.env.PORT ||
      serverOptions.port ||
      (await findPort(serverOptions.startingPort || 8080)),
  )

  await serverListen(server, { hostname, port })

  const url = new URL(`${scheme}://${hostname}:${port}`)

  log({ who, message: "startServer", url: String(url) })
}
