import { Command, CommandRunner } from "@xieyuheng/command-line"
import ty from "@xieyuheng/ty"
import inquirer from "inquirer"
import * as ReverseProxyClient from "../../reverse-proxy-client"
import { loggedInGet } from "../../reverse-proxy-client/loggedInGet"
import { changeLogger, log } from "../../utils/log"

type Args = { url: string }
type Opts = {
  logger?: string
}

export class ReverseProxyLoginCommand extends Command<Args> {
  name = "reverse-proxy:login"

  description = "Login to a reverse proxy server"

  args = { url: ty.string() }
  opts = {
    logger: ty.optional(ty.string()),
  }

  // prettier-ignore
  help(runner: CommandRunner): string {
    const { blue } = this.colors

    return [
      `The ${blue(this.name)} command takes a url of a reverse proxy server,`,
      `and login to it by username and password,`,
      `the returned token will be saved to ~/.fidb/`,
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

    const url = new URL(argv.url)

    const found = await loggedInGet(url.href)
    if (found !== undefined) {
      log({
        who,
        message: `already logged in to url, logout first`,
        url: String(url),
        username: found.username,
      })

      process.exit(1)
    }

    const { username } = await inquirer.prompt([
      { type: "input", name: "username", message: "Username" },
    ])

    const { password } = await inquirer.prompt([
      { type: "password", name: "password", message: "Password", mask: "*" },
    ])

    await ReverseProxyClient.login({
      url,
      username,
      password,
    })
  }
}
