import { ServerOptions } from "../../server/ServerOptions"
import { createRequestListener } from "../../server/createRequestListener"
import { startServer } from "../../server/startServer"
import { log } from "../../utils/log"
import { createContext } from "./createContext"
import { handle } from "./handle"

export async function startSubdomainServer(
  path: string,
  serverOptions: ServerOptions,
): Promise<void> {
  const who = "startSubdomainServer"

  const ctx = await createContext({ path, server: serverOptions })

  log({ who, message: "createContext", ctx })

  const listener = createRequestListener({ ctx, handle })

  const { url } = await startServer(listener, serverOptions)

  log({ who, message: "startServer", url: String(url) })
}
