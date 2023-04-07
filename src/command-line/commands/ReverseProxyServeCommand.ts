import { Command, CommandRunner } from "@xieyuheng/command-line"
import ty from "@xieyuheng/ty"
import { handle } from "../../reverse-proxy-server"
import { createContext } from "../../reverse-proxy-server/Context"
import { createRequestListener } from "../../server/createRequestListener"
import { startServer } from "../../server/startServer"
import { changeLogger, log } from "../../utils/log"
import { findPort } from "../../utils/node/findPort"

type Args = {}
type Opts = {
  database: string
  domain: string
  port?: number | Array<number>
  "tls-cert"?: string
  "tls-key"?: string
  logger?: string
}

export class ReverseProxyServeCommand extends Command<Args> {
  name = "reverse-proxy:serve"

  description = "Serve a reverse proxy"

  args = {}
  opts = {
    database: ty.string(),
    domain: ty.string(),
    port: ty.optional(ty.union(ty.number(), ty.array(ty.number()))),
    "tls-cert": ty.optional(ty.string()),
    "tls-key": ty.optional(ty.string()),
    logger: ty.optional(ty.string()),
  }

  // prettier-ignore
  help(runner: CommandRunner): string {
    const { blue } = this.colors

    return [
      `The ${blue(this.name)} command takes a path to a directory,`,
      `using it as a database, and serve a reverse proxy.`,
      ``,
      blue(`  ${runner.name} ${this.name} --database tmp/databases/reverse-proxy`),
      ``,
    ].join("\n")
  }

  async execute(argv: Args & Opts): Promise<void> {
    if (argv.logger) {
      changeLogger(argv.logger)
    }

    const who = this.name

    const tls =
      argv["tls-cert"] && argv["tls-key"]
        ? {
            certPath: argv["tls-cert"],
            keyPath: argv["tls-key"],
          }
        : undefined

    if (typeof argv.port === "number" || argv.port === undefined) {
      const channelServerPort = await findPort(10000)

      const ctx = await createContext({
        path: argv.database,
        domain: argv.domain,
        availablePorts: [Number(argv.port)],
        channelServerPort,
      })

      await ctx.broker.backend.bind(`tcp://*:${channelServerPort}`)
      const requestListener = createRequestListener({ ctx, handle })

      const { url } = await startServer(requestListener, {
        hostname: argv.domain,
        port: argv.port,
        startingPort: 3000,
        tls,
      })

      log({ who, ctx, url: String(url), tls })
    }

    if (argv.port instanceof Array) {
      const urls = []

      for (const port of argv.port) {
        // NOTE `ctx` must not be shared.
        const channelServerPort = await findPort(10000)

        const ctx = await createContext({
          path: argv.database,
          domain: argv.domain,
          availablePorts: argv.port.map(Number),
          channelServerPort,
        })

        await ctx.broker.backend.bind(`tcp://*:${channelServerPort}`)
        const requestListener = createRequestListener({ ctx, handle })

        const { url } = await startServer(requestListener, {
          hostname: argv.domain,
          port,
          tls,
        })
        urls.push(url)
      }

      log({
        who,
        path: argv.database,
        domain: argv.domain,
        availablePorts: argv.port.map(Number),
        urls: urls.map(String),
        tls,
      })
    }
  }
}
