import type { RequestListener } from "../server/createRequestListener"
import { findPort } from "../utils/node/findPort"
import { serverListen } from "../utils/node/serverListen"
import { StartServerOptions } from "./StartServerOptions"
import { createServer } from "./createServer"

export async function startServer(
  requestListener: RequestListener,
  options: StartServerOptions,
): Promise<{ url: URL }> {
  const { scheme, server } = await createServer(requestListener, options)

  const hostname = options.hostname || "127.0.0.1"
  const port = Number(
    process.env.PORT ||
      options.port ||
      (await findPort(options.startingPort || 8080)),
  )

  await serverListen(server, { hostname, port })

  const url = new URL(`${scheme}://${hostname}:${port}`)

  return { url }
}
