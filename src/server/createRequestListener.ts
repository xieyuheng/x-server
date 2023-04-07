import { Errors as TyErrors } from "@xieyuheng/ty"
import type Http from "node:http"
import { AlreadyExists } from "../errors/AlreadyExists"
import { NotFound } from "../errors/NotFound"
import { Processing } from "../errors/Processing"
import { RevisionMismatch } from "../errors/RevisionMismatch"
import { Unauthorized } from "../errors/Unauthorized"
import { Unprocessable } from "../errors/Unprocessable"
import type { Json } from "../utils/Json"
import { responseSetHeaders } from "../utils/node/responseSetHeaders"
import { responseSetStatus } from "../utils/node/responseSetStatus"

export type RequestListener = (
  request: Http.IncomingMessage,
  response: Http.ServerResponse,
) => Promise<void>

export type HandleRequest<Context> = (
  ctx: Context,
  request: Http.IncomingMessage,
  response: Http.ServerResponse,
) => Promise<Json | Buffer | void>

export function createRequestListener<Context>(options: {
  ctx: Context
  handle: HandleRequest<Context>
}): RequestListener {
  const { ctx, handle } = options
  return async (request, response) => {
    try {
      const body = await handle(ctx, request, response)

      if (response.writableEnded) {
        return
      }

      if (body === undefined) {
        responseSetStatus(response, { code: 204 })
        responseSetHeaders(response, {
          "content-type": "application/json",
          "access-control-allow-origin": "*",
          connection: "close",
        })
        response.end()
      } else if (body instanceof Buffer) {
        responseSetStatus(response, { code: 200 })
        responseSetHeaders(response, {
          "content-type": "text/plain",
          "access-control-allow-origin": "*",
          connection: "close",
        })
        response.write(body)
        response.end()
      } else {
        responseSetStatus(response, { code: 200 })
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
