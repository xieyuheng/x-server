import fs from "node:fs"
import Http, { RequestListener } from "node:http"
import Https from "node:https"
import { ServerOptions } from "./ServerOptions"

export async function createServer(
  requestListener: RequestListener,
  options: ServerOptions,
): Promise<Http.Server | Https.Server> {
  if (options.tls) {
    return Https.createServer(
      {
        cert: await fs.promises.readFile(options.tls.cert),
        key: await fs.promises.readFile(options.tls.key),
        // SNICallback: (name, cb) => {
        //   console.log(name)
        //   cb(null, null)
        // }
      },
      requestListener,
    )
  } else {
    return Http.createServer({}, requestListener)
  }
}
