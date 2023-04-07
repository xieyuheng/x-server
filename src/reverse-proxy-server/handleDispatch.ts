import type Http from "node:http"
import type { Socket } from "node:net"
import { NotFound } from "../errors/NotFound"
import { Processing } from "../errors/Processing"
import { encrypt } from "../utils/encrypt"
import { requestFormatRaw } from "../utils/node/requestFormatRaw"
import { randomHexString } from "../utils/randomHexString"
import type { Context } from "./Context"
import { requestSubdomain } from "./requestSubdomain"

export async function handleDispatch(
  ctx: Context,
  request: Http.IncomingMessage,
  response: Http.ServerResponse,
): Promise<void> {
  const who = "handleDispatch"

  const subdomin = requestSubdomain(ctx, request)
  if (subdomin === undefined) {
    const host = request.headers["host"]
    throw new NotFound(`[handleDispatch] no subdomain in request host: ${host}`)
  }

  const service = ctx.broker.services.get(subdomin)
  if (service === undefined) {
    throw new NotFound(`[handleDispatch] unknown subdomain: ${subdomin}`)
  }

  const rawRequest = await requestFormatRaw(request)
  const socket = response.socket as Socket

  if (!socket) {
    throw new Error(`[${who}] no response.socket`)
  }

  const requestId = `${socket.remoteAddress}:${
    socket.remotePort
  }#${randomHexString(10)}`

  service.requestSockets.set(requestId, socket)

  service.requests.push({
    requestId,
    request: Buffer.from(await encrypt(rawRequest, service.encryptionKey)),
  })

  throw new Processing(`[${who}]`)
}
