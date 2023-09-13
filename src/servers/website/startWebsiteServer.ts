import { createRequestListener } from "../../server/createRequestListener"
import { startServer } from "../../server/startServer"
import { log } from "../../utils/log"
import { WebsiteConfig } from "../../website/WebsiteConfig"
import { createContext } from "./createContext"
import { handle } from "./handle"

export async function startWebsiteServer(
  path: string,
  config: WebsiteConfig,
): Promise<void> {
  const who = "startWebsiteServer"

  const ctx = await createContext({ path, config })

  log({ who, message: "createContext", ctx })

  const server = config.server || {}
  const logger = config.logger || {}

  const listener = createRequestListener({ ctx, handle, server, logger })
  const { url } = await startServer(listener, server)

  log({ who, message: "startServer", url: String(url) })
}
