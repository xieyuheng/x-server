import { markRaw } from "@vue/runtime-core"
import type { Socket } from "node:net"

export type Service = {
  name: string
  encryptionKey: Uint8Array
  requestSockets: Map<string, Socket>
  requests: Array<{ requestId: string; request: Buffer }>
  workerIds: Array<Buffer>
}

export function createService(
  name: string,
  encryptionKey: Uint8Array,
  options?: {
    requests?: Array<{ requestId: string; request: Buffer }>
    workerIds?: Array<Buffer>
  },
): Service {
  return {
    name,
    encryptionKey,
    requestSockets: markRaw(new Map()),
    requests: options?.requests || [],
    workerIds: options?.workerIds || [],
  }
}
