import { createRequestListener } from "../../server/createRequestListener"
import { createServer } from "../../server/createServer"
import { serverListenWithDefault } from "../../server/serverListenWithDefault"
import { log } from "../../utils/log"
import { WebsiteConfig } from "../../website/WebsiteConfig"
import { createContext } from "./createContext"
import { handle } from "./handle"

export async function startServer(
  path: string,
  rootConfig: WebsiteConfig,
): Promise<void> {
  const who = "subdomain/startServer"

  const ctx = await createContext({ path, rootConfig })
  log({ who, message: "createContext", ctx })

  const { logger } = rootConfig
  const listener = createRequestListener({ ctx, handle, logger })

  const serverOptions = rootConfig.server || {}

  const server = await createServer(listener, serverOptions)

  await serverListenWithDefault(server, serverOptions)
}
