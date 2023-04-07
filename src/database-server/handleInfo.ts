import type Http from "node:http"
import type { Json } from "../utils/Json"
import type { Context } from "./Context"

export async function handleInfo(
  ctx: Context,
  request: Http.IncomingMessage,
): Promise<Json | void> {
  const { db } = ctx

  if (request.method === "GET") {
    return {
      db: {
        config: db.config
          ? {
              name: db.config.name,
              description: db.config.description || null,
              authDirectories: db.config.authDirectories || null,
            }
          : null,
      },
    }
  }

  throw new Error(
    [`[handleInfo] unhandled http request`, `  method: ${request.method}`].join(
      "\n",
    ),
  )
}
