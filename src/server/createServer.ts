import fs from "node:fs"
import Http, { RequestListener } from "node:http"
import Https from "node:https"
import { ServerOptions } from "./ServerOptions"

type Result =
  | { scheme: "http"; server: Http.Server }
  | { scheme: "https"; server: Https.Server }

export async function createServer(
  requestListener: RequestListener,
  options: ServerOptions,
): Promise<Result> {
  if (options.tls) {
    return {
      scheme: "https",
      server: Https.createServer(
        {
          cert: await fs.promises.readFile(options.tls.cert),
          key: await fs.promises.readFile(options.tls.key),
          // SNICallback: (name, cb) => {
          //   console.log(name)
          //   cb(null, null)
          // }
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
