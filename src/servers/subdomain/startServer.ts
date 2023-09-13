import fs from "node:fs"
import Http from "node:http"
import Https from "node:https"
import tls from "node:tls"
import { createRequestListener } from "../../server/createRequestListener"
import { serverListenWithDefault } from "../../server/serverListenWithDefault"
import { findCertificate } from "../../subdomain/findCertificate"
import { log } from "../../utils/log"
import { WebsiteConfig } from "../../website/WebsiteConfig"
import { createContext } from "./createContext"
import { handle } from "./handle"

export async function startServer(
  path: string,
  config: WebsiteConfig,
): Promise<void> {
  const who = "subdomain/startServer"

  const ctx = await createContext({ path, config })
  log({ who, message: "createContext", ctx })

  const listener = createRequestListener({ ctx, handle, logger: config.logger })

  if (config.server?.tls) {
    const server = Https.createServer(
      {
        cert: await fs.promises.readFile(config.server.tls.cert),
        key: await fs.promises.readFile(config.server.tls.key),
        SNICallback: async (hostname, changeSecureContext) => {
          const certificate = await findCertificate(ctx.directory, hostname)
          if (certificate !== undefined) {
            const secureContext = tls.createSecureContext({ ...certificate })
            changeSecureContext(null, secureContext)
          } else {
            changeSecureContext(null, undefined)
          }
        },
      },
      listener,
    )
    await serverListenWithDefault(server, config.server)
  } else {
    const server = Http.createServer({}, listener)
    await serverListenWithDefault(server, config.server)
  }
}
