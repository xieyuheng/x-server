import { Errors as TyErrors } from "@xieyuheng/ty"
import type Http from "node:http"
import { AlreadyExists } from "../errors/AlreadyExists"
import { NotFound } from "../errors/NotFound"
import { Processing } from "../errors/Processing"
import { RevisionMismatch } from "../errors/RevisionMismatch"
import { Unauthorized } from "../errors/Unauthorized"
import { Unprocessable } from "../errors/Unprocessable"
import type { Json } from "../utils/Json"
import { log } from "../utils/log"
import { responseSetHeaders } from "../utils/node/responseSetHeaders"
import { responseSetStatus } from "../utils/node/responseSetStatus"
import { RequestListener } from "./RequestListener"

export type RequestHandler<Context> = (
  ctx: Context,
  request: Http.IncomingMessage,
  response: Http.ServerResponse,
) => Promise<Json | Buffer | void>
