import { Command, CommandRunner } from "@xieyuheng/command-line"
import ty from "@xieyuheng/ty"
import { createContext } from "../../handle/Context"
import { handleServe } from "../../handle/handleServe"
import { createRequestListener } from "../../server/createRequestListener"
import { startServer } from "../../server/startServer"
import { changeLogger, log } from "../../utils/log"

type Args = { path: string }
type Opts = {
  hostname?: string
  port?: number
  "rewrite-not-found-to"?: string
  "cache-control-pattern"?: string | Array<string>
  cors?: boolean
  "tls-cert"?: string
  "tls-key"?: string
  logger?: string
}

export class ServeCommand extends Command<Args> {
  name = "serve"

  description = "Serve a website"

  args = { path: ty.string() }
  opts = {
    hostname: ty.optional(ty.string()),
    port: ty.optional(ty.number()),
    "rewrite-not-found-to": ty.optional(ty.string()),
    "cache-control-pattern": ty.optional(
      ty.union(ty.string(), ty.array(ty.string())),
    ),
    cors: ty.optional(ty.boolean()),
    "tls-cert": ty.optional(ty.string()),
    "tls-key": ty.optional(ty.string()),
    logger: ty.optional(ty.string()),
  }

  // prettier-ignore
  help(runner: CommandRunner): string {
    const { blue } = this.colors

    return [
      `The ${blue(this.name)} command takes a path to a directory,`,
      `and serve it as a website.`,
      ``,
      blue(`  ${runner.name} ${this.name} dist`),
      ``,
    ].join("\n")
  }

  async execute(argv: Args & Opts): Promise<void> {
    if (argv.logger) {
      changeLogger(argv.logger)
    }

    const who = this.name

    const cacheControlPatterns = createCacheControlPatterns(
      argv["cache-control-pattern"],
    )

    const ctx = await createContext({
      path: argv.path,
      rewriteNotFoundTo: argv["rewrite-not-found-to"],
      cacheControlPatterns,
      cors: argv["cors"],
    })

    const requestListener = createRequestListener({ ctx, handle: handleServe })
    const tls =
      argv["tls-cert"] && argv["tls-key"]
        ? {
            certPath: argv["tls-cert"],
            keyPath: argv["tls-key"],
          }
        : undefined

    const { url } = await startServer(requestListener, {
      hostname: argv.hostname,
      port: argv.port,
      startingPort: 8080,
      tls,
    })

    log({ who, ctx, url: String(url), tls })
  }
}

function createCacheControlPatterns(
  input: undefined | string | Array<string>,
): Record<string, string> {
  if (input === undefined) {
    return {}
  }

  if (typeof input === "string") {
    const [pattern, value] = input.split(":").map((s) => s.trim())
    return Object.fromEntries([[pattern, value]])
  }

  return Object.fromEntries(
    input.map((entry) => entry.split(":").map((s) => s.trim())),
  )
}
