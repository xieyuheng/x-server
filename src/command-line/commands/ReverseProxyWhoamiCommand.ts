import { Command, CommandRunner } from "@xieyuheng/command-line"
import ty from "@xieyuheng/ty"
import { loggedInGet } from "../../reverse-proxy-client/loggedInGet"
import { loggedInGetRecord } from "../../reverse-proxy-client/loggedInGetRecord"
import { changeLogger, log } from "../../utils/log"

type Args = { url?: string }
type Opts = {
  logger?: string
}

export class ReverseProxyWhoamiCommand extends Command<Args> {
  name = "reverse-proxy:whoami"

  description = "See who I logged in for a given reverse proxy server"

  args = { url: ty.optional(ty.string()) }
  opts = {
    logger: ty.optional(ty.string()),
  }

  // prettier-ignore
  help(runner: CommandRunner): string {
    const { blue } = this.colors

    return [
      `The ${blue(this.name)} command takes a url of a reverse proxy server,`,
      `and print the username that is logged in.`,
      ``,
      `If no specific url is given,`,
      `list all the logged in usernames.`,
      ``,
      blue(`  ${runner.name} ${this.name} https://fidb.app`),
      ``,
    ].join("\n")
  }

  async execute(argv: Args & Opts): Promise<void> {
    if (argv.logger) {
      changeLogger(argv.logger)
    }

    const who = this.name

    if (argv.url !== undefined) {
      const url = new URL(argv.url)

      const found = await loggedInGet(url.href)
      if (found !== undefined) {
        console.log(found.username)
      } else {
        process.exit(1)
      }
    }

    const loggedInRecord = await loggedInGetRecord()
    log({ who, loggedInRecord })
  }
}
