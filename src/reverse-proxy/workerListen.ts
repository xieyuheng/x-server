import { Socket } from "node:net"
import { decrypt } from "../utils/decrypt"
import { encrypt } from "../utils/encrypt"
import { log } from "../utils/log"
import type { Worker } from "./Worker"

export async function workerListen(worker: Worker) {
  const who = "worker"

  for await (const [kind, requestId, request] of worker.dealer) {
    switch (String(kind)) {
      case "Request": {
        const localSocket = new Socket()

        localSocket.connect(worker.local.port, worker.local.hostname)

        localSocket.on("connect", async () => {
          log({ who, message: "localSocket connected" })

          localSocket.write(await decrypt(request, worker.encryptionKey))

          log({
            who,
            message: "request sent to localSocket",
            length: request.length,
          })
        })

        localSocket.on("close", () => {
          log({ who, message: "localSocket closed" })
        })

        for await (const data of localSocket) {
          await worker.dealer.send([
            "Data",
            worker.subdomain,
            requestId,
            await encrypt(data, worker.encryptionKey),
            data,
          ])

          log({
            who,
            message: "Data",
            length: data.length,
          })
        }

        await worker.dealer.send(["End", worker.subdomain, requestId])
        log({ who, message: "End" })
      }
    }
  }
}
