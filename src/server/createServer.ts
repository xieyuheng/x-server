import fs from "node:fs"
import Http from "node:http"
import Https from "node:https"
import type { RequestListener } from "../server/createRequestListener"

export type TlsOptions = {
  certPath: string
  keyPath: string
}

type Options = {
  tls?: TlsOptions
}

type Result =
  | { scheme: "http"; server: Http.Server }
  | { scheme: "https"; server: Https.Server }

export async function createServer(
  requestListener: RequestListener,
  options: Options,
): Promise<Result> {
  if (options.tls) {
    return {
      scheme: "https",
      server: Https.createServer(
        {
          cert: await fs.promises.readFile(options.tls.certPath),
          key: await fs.promises.readFile(options.tls.keyPath),
        },
        requestListener,
      ),
    }
  } else {
    return {
      scheme: "http",
      server: Http.createServer({}, requestListener),
    }
  }
}
