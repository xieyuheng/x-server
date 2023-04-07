import { ty } from "@xieyuheng/ty"
import type Http from "node:http"
import { requestToken } from "../database-server/requestToken"
import * as Db from "../db"
import { Unauthorized } from "../errors/Unauthorized"
import { createService } from "../reverse-proxy/Service"
import { serviceReactive } from "../reverse-proxy/serviceReactive"
import { tokenAssert } from "../token"
import type { Json } from "../utils/Json"
import { generateEncryptionKey } from "../utils/generateEncryptionKey"
import { requestJsonObject } from "../utils/node/requestJsonObject"
import { randomHexString } from "../utils/randomHexString"
import type { Context } from "./Context"
import { SubdomainSchema } from "./SubdomainSchema"

export type ChannelInfo = {
  username: string
  subdomain: string
  encryptionKey: Uint8Array
}

export async function handleChannel(
  ctx: Context,
  request: Http.IncomingMessage,
): Promise<Json | void> {
  const who = "handleChannel"

  const token = await requestToken(ctx, request)

  if (request.method === "POST") {
    const schema = ty.object({
      subdomain: ty.string(),
      username: ty.string(),
    })

    const { subdomain, username } = schema.validate(
      await requestJsonObject(request),
    )

    tokenAssert(token, `users/${username}`, "read")

    await assertSubdomainUsable(ctx, subdomain, username)

    if (request.socket === null) {
      return
    }

    const workerId = `${request.socket.remoteAddress}#${randomHexString(16)}`

    const encryptionKey = await generateEncryptionKey()
    const encryptionKeyText = Buffer.from(encryptionKey).toString("hex")

    const channelInfo: ChannelInfo = { username, subdomain, encryptionKey }

    ctx.channelInfos[workerId] = channelInfo

    ctx.broker.services.set(
      subdomain,
      serviceReactive(ctx.broker, createService(subdomain, encryptionKey)),
    )

    return {
      channelServerPort: ctx.channelServerPort,
      workerId,
      encryptionKeyText,
    }
  }

  throw new Error(
    [`[${who}] unhandled http request`, `  method: ${request.method}`].join(
      "\n",
    ),
  )
}

export async function assertSubdomainUsable(
  ctx: Context,
  subdomain: string,
  username: string,
): Promise<void> {
  const who = "assertSubdomainUsable"

  const subdomainData = await Db.dataGet(ctx.db, `subdomains/${subdomain}`)
  if (subdomainData === undefined) {
    throw new Unauthorized(
      `[${who}] subdomain: ${subdomain} can not be used by username: ${username}`,
    )
  }

  const { usernames } = SubdomainSchema.validate(subdomainData)
  if (!usernames.includes(username)) {
    throw new Unauthorized(
      `[${who}] subdomain: ${subdomain} can not be used by username: ${username}`,
    )
  }
}
