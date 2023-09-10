import { createRequestListener } from "../../server/createRequestListener"
import { startServer } from "../../server/startServer"
import { log } from "../../utils/log"
import { WebsiteConfig } from "../../website/WebsiteConfig"
import { createContext } from "./Context"
import { handle } from "./handle"

export async function startWebsiteServer(
  path: string,
  config: WebsiteConfig,
): Promise<void> {
  const who = "startWebsiteServer"

  const ctx = await createContext({ path, config })

  log({ who, message: "createContext", ctx })

  const listener = createRequestListener({ ctx, handle })

  const { url } = await startServer(listener, config)

  log({ who, message: "startServer", url: String(url) })
}
