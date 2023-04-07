import type { Broker } from "./Broker"

export function brokerPrepareWorker(
  broker: Broker,
  serviceName: string,
  workerId: Buffer,
): void {
  const service = broker.services.get(serviceName)
  if (service === undefined) {
    // TODO
  } else {
    service.workerIds.push(workerId)
  }
}
