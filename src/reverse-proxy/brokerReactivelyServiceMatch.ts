import { watch } from "@vue/runtime-core"
import type { Broker } from "./Broker"
import { brokerServiceMatch } from "./brokerServiceMatch"
import type { Service } from "./Service"

export function brokerReactivelyServiceMatch(broker: Broker, service: Service) {
  watch(
    () => service.workerIds.length,
    () => {
      brokerServiceMatch(broker, service)
    },
  )
  watch(
    () => service.requests.length,
    () => {
      brokerServiceMatch(broker, service)
    },
  )
}
