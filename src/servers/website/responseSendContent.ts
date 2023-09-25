import type { Buffer } from "node:buffer"
import type Http from "node:http"
import type { Json } from "../../utils/Json"
import { log } from "../../utils/log"
import { compress } from "../../utils/node/compress"
import { requestCompressionMethod } from "../../utils/node/requestCompressionMethod"
import { requestPathname } from "../../utils/node/requestPathname"
import { responseSetHeaders } from "../../utils/node/responseSetHeaders"
import { responseSetStatus } from "../../utils/node/responseSetStatus"
import { Content } from "../../website/Content"

export async function responseSendContent(
  request: Http.IncomingMessage,
  response: Http.ServerResponse,
  content: Content | undefined,
  options: {
    withLog: boolean
  },
): Promise<Json | Buffer | void> {
  const who = "responseSendContent"
  const { withLog } = options
  const pathname = requestPathname(request)

  if (content === undefined) {
    const code = 404
    if (withLog) log({ who, pathname, code })
    responseSetStatus(response, { code })
    responseSetHeaders(response, { connection: "close" })
    response.end()
  } else {
    const compressionMethod = requestCompressionMethod(request)
    const buffer = await compress(compressionMethod, content.buffer)
    const code = 200
    if (options.withLog)
      log({ who, pathname, code, "content-type": content.type })
    responseSetStatus(response, { code })
    responseSetHeaders(response, {
      "content-type": content.type,
      "content-encoding": compressionMethod,
      connection: "close",
    })
    response.end(buffer)
  }
}
