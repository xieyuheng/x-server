import type { Server } from "node:net"

export type ServerListenOptions = {
  hostname?: string
  port?: number | string
}

export function serverListen(
  server: Server,
  options: ServerListenOptions,
): Promise<void> {
  return new Promise((resolve, reject) => {
    server.listen(options, () => {
      resolve()
    })

    server.on("error", (error) => {
      reject(error)
    })
  })
}
