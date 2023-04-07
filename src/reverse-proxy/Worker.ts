import * as Zmq from "zeromq"
import { workerListen } from "./workerListen"

export type Worker = {
  dealer: Zmq.Dealer
  subdomain: string
  encryptionKey: Uint8Array
  local: { hostname: string; port: number }
}

export async function createWorker(options: {
  hostname: string
  subdomain: string
  local: { hostname: string; port: number }
  ticket: {
    channelServerPort: number
    encryptionKeyText: string
    workerId: string
  }
}): Promise<Worker> {
  const { hostname, subdomain, local, ticket } = options

  const dealer = new Zmq.Dealer({ sendHighWaterMark: 1 })

  dealer.routingId = ticket.workerId
  dealer.connect(`tcp://${hostname}:${ticket.channelServerPort}`)

  const encryptionKey = Buffer.from(ticket.encryptionKeyText, "hex")

  const worker = { dealer, subdomain, encryptionKey, local }

  await dealer.send(["Ready", subdomain])

  workerListen(worker)

  // for (const eventType of eventTypes()) {
  //   worker.dealer.events.on(eventType, (event) => {
  //     console.log({ who: "worker", event })
  //   })
  // }

  return worker
}
