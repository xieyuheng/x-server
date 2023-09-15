import { Errors as TyErrors } from "@xieyuheng/ty"
import { AlreadyExists } from "../errors/AlreadyExists"
import { NotFound } from "../errors/NotFound"
import { Processing } from "../errors/Processing"
import { RevisionMismatch } from "../errors/RevisionMismatch"
import { Unauthorized } from "../errors/Unauthorized"
import { Unprocessable } from "../errors/Unprocessable"
import { log } from "../utils/log"
import { responseSetHeaders } from "../utils/node/responseSetHeaders"
import { responseSetStatus } from "../utils/node/responseSetStatus"
import { LoggerOptions } from "./LoggerOptions"
import { RequestHandler } from "./RequestHandler"
import { RequestListener } from "./RequestListener"

export function createRequestListener<Context>(options: {
  ctx: Context
  handle: RequestHandler<Context>
  logger?: LoggerOptions
}): RequestListener {
  const { ctx, handle } = options
  return async (request, response) => {
    const withLog = !options.logger?.disableRequestLogging

    try {
      const body = await handle(ctx, request, response)

      if (response.writableEnded) {
        return
      }

      if (body === undefined) {
        const code = 204
        responseSetStatus(response, { code })
        responseSetHeaders(response, {
          "content-type": "application/json",
          "access-control-allow-origin": "*",
          connection: "close",
        })
        response.end()
      } else if (body instanceof Buffer) {
        const code = 200
        responseSetStatus(response, { code })
        responseSetHeaders(response, {
          "content-type": "text/plain",
          "access-control-allow-origin": "*",
          connection: "close",
        })
        response.write(body)
        response.end()
      } else {
        const code = 200

        responseSetStatus(response, { code })
        responseSetHeaders(response, {
          "content-type": "application/json",
          "access-control-allow-origin": "*",
          connection: "close",
        })
        response.write(JSON.stringify(body))
        response.end()
      }
    } catch (error) {
      if (error instanceof Processing) {
        return
      }

      const headers = {
        "content-type": "application/json",
        "access-control-allow-origin": "*",
        connection: "close",
      }

      const message = error instanceof Error ? error.message : "Unknown error"

      if (withLog)
        log({
          who: "RequestListener",
          kind: "Error",
          message,
          host: request.headers.host,
          url: request.url,
        })

      if (error instanceof Unauthorized) {
        responseSetStatus(response, { code: 401, message })
        responseSetHeaders(response, headers)
        response.end()
      } else if (error instanceof AlreadyExists) {
        responseSetStatus(response, { code: 403, message })
        responseSetHeaders(response, headers)
        response.end()
      } else if (error instanceof NotFound) {
        responseSetStatus(response, { code: 404, message })
        responseSetHeaders(response, headers)
        response.end()
      } else if (error instanceof RevisionMismatch) {
        responseSetStatus(response, { code: 409, message })
        responseSetHeaders(response, headers)
        response.end()
      } else if (error instanceof Unprocessable) {
        responseSetStatus(response, { code: 422, message })
        responseSetHeaders(response, headers)
        response.end()
      } else if (TyErrors.InvalidData.guard(error)) {
        responseSetStatus(response, { code: 422, message })
        responseSetHeaders(response, headers)
        response.write(
          JSON.stringify({
            errors: { [error.path]: error.msg },
          }),
        )
        response.end()
      } else {
        responseSetStatus(response, { code: 500, message })
        responseSetHeaders(response, headers)
        response.end()
      }
    }
  }
}
