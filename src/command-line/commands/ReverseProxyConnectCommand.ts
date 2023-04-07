import { Command, CommandRunner } from "@xieyuheng/command-line"
import ty from "@xieyuheng/ty"
import * as ReverseProxyClient from "../../reverse-proxy-client"
import { changeLogger, log } from "../../utils/log"

type Args = { path: string }
type Opts = {
  "local-url": string
  "public-url": string
  logger?: string
}

export class ReverseProxyConnectCommand extends Command<Args> {
  name = "reverse-proxy:connect"

  description = "Connect a http server to a reverse proxy"

  args = { path: ty.string() }
  opts = {
    "local-url": ty.string(),
    "public-url": ty.string(),
    logger: ty.optional(ty.string()),
  }

  // prettier-ignore
  help(runner: CommandRunner): string {
    const { blue } = this.colors

    return [
      `The ${blue(this.name)} command takes a local url to a http server and a public url of reverse proxy server,`,
      `and connect them.`,
      ``,
      blue(`  ${runner.name} ${this.name} --local-url http://localhost:8000 --public-url https://pomodoro.fidb.app`),
      ``,
    ].join("\n")
  }

  async execute(argv: Args & Opts): Promise<void> {
    if (argv.logger) {
      changeLogger(argv.logger)
    }

    const who = this.name

    const localURL = new URL(argv["local-url"])
    const publicURL = new URL(argv["public-url"])

    const successful = await ReverseProxyClient.connect({
      publicURL,
      local: {
        hostname: localURL.hostname,
        port: Number(localURL.port),
      },
    })

    log({ who, publicURL, localURL })

    if (!successful) {
      process.exit(1)
    }
  }
}
