import { decrypt } from "../utils/decrypt"
import { log } from "../utils/log"
import type { Broker } from "./Broker"
import { brokerPrepareWorker } from "./brokerPrepareWorker"

export async function brokerHandleMessage(
  broker: Broker,
  message: Array<Buffer>,
) {
  const who = "brokerHandleMessage"

  const [workerId, kind, serviceName, ...rest] = message

  switch (String(kind)) {
    case "Ready": {
      log({
        who,
        message: "Ready",
        serviceName: String(serviceName),
        workerId: String(workerId),
      })

      brokerPrepareWorker(broker, String(serviceName), workerId)
      return
    }

    case "Data": {
      const [requestId, data] = rest

      brokerPrepareWorker(broker, String(serviceName), workerId)

      const service = broker.services.get(String(serviceName))
      if (service === undefined) {
        return
      }

      const requestSocket = service.requestSockets.get(String(requestId))
      if (requestSocket === undefined) {
        return
      }

      log({
        who,
        message: "Data",
        serviceName: String(serviceName),
        workerId: String(workerId),
      })

      requestSocket.write(await decrypt(data, service.encryptionKey))
      return
    }

    case "End": {
      const [requestId] = rest

      brokerPrepareWorker(broker, String(serviceName), workerId)

      const service = broker.services.get(String(serviceName))
      if (service === undefined) {
        return
      }

      const requestSocket = service.requestSockets.get(String(requestId))
      if (requestSocket === undefined) {
        return
      }

      requestSocket.end()

      log({
        who,
        message: "End",
        serviceName: String(serviceName),
        workerId: String(workerId),
      })

      service.requestSockets.delete(String(requestId))
      return
    }

    default: {
      log({
        who,
        message: `Unknown kind: ${String(kind)}`,
        serviceName: String(serviceName),
        workerId: String(workerId),
      })
      return
    }
  }
}
