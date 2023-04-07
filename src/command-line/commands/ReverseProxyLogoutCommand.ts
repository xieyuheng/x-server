import { Command, CommandRunner } from "@xieyuheng/command-line"
import ty from "@xieyuheng/ty"
import { loggedInDelete } from "../../reverse-proxy-client/loggedInDelete"

type Args = { url: string }
type Opts = {}

export class ReverseProxyLogoutCommand extends Command<Args> {
  name = "reverse-proxy:logout"

  description = "Logout a user for a given reverse proxy server"

  args = { url: ty.string() }
  opts = {}

  // prettier-ignore
  help(runner: CommandRunner): string {
    const { blue } = this.colors

    return [
      `The ${blue(this.name)} command takes a url of a reverse proxy server,`,
      `and logout the user if any.`,
      ``,
      blue(`  ${runner.name} ${this.name} https://fidb.app`),
      ``,
    ].join("\n")
  }

  async execute(argv: Args & Opts): Promise<void> {
    const url = new URL(argv.url)

    const actuallyDeleted = await loggedInDelete(url.href)
    if (!actuallyDeleted) {
      process.exit(1)
    }
  }
}
