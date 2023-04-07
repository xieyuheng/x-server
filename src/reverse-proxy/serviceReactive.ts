import { reactive } from "@vue/runtime-core"
import type { Broker } from "./Broker"
import { brokerReactivelyServiceMatch } from "./brokerReactivelyServiceMatch"
import type { Service } from "./Service"

export function serviceReactive(broker: Broker, service: Service): Service {
  service = reactive(service) as Service

  brokerReactivelyServiceMatch(broker, service)

  return service
}
