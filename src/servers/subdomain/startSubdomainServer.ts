import { createRequestListener } from "../../server/createRequestListener"
import { startServer } from "../../server/startServer"
import { log } from "../../utils/log"
import { WebsiteConfig } from "../../website/WebsiteConfig"
import { createContext } from "./createContext"
import { handle } from "./handle"

export async function startSubdomainServer(
  path: string,
  rootConfig: WebsiteConfig,
): Promise<void> {
  const who = "startSubdomainServer"

  const ctx = await createContext({ path, rootConfig })

  log({ who, message: "createContext", ctx })

  const server = rootConfig?.server || {}
  const logger = rootConfig?.logger || {}

  const listener = createRequestListener({ ctx, handle, server, logger })
  const { url } = await startServer(listener, server)

  log({ who, message: "startServer", url: String(url) })
}
