import type { Broker } from "./Broker"
import { brokerHandleMessage } from "./brokerHandleMessage"

export async function brokerListen(broker: Broker) {
  for await (const message of broker.backend) {
    await brokerHandleMessage(broker, message)
  }
}
