import type { Broker } from "./Broker"
import type { Service } from "./Service"

export async function brokerServiceMatch(
  broker: Broker,
  service: Service,
): Promise<void> {
  while (service.requests.length > 0 && service.workerIds.length > 0) {
    const { requestId, request } = service.requests.shift()!
    const workerId = service.workerIds.shift()!
    await broker.backend.send([workerId, "Request", requestId, request])
  }
}
