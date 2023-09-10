import fs from "node:fs"
import Http, { RequestListener } from "node:http"
import Https from "node:https"
import { TlsOptions } from "./TlsOptions"

type SreateServerOptions = {
  tls?: TlsOptions
}

type Result =
  | { scheme: "http"; server: Http.Server }
  | { scheme: "https"; server: Https.Server }

export async function createServer(
  requestListener: RequestListener,
  options: SreateServerOptions,
): Promise<Result> {
  if (options.tls) {
    return {
      scheme: "https",
      server: Https.createServer(
        {
          cert: await fs.promises.readFile(options.tls.cert),
          key: await fs.promises.readFile(options.tls.key),
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
