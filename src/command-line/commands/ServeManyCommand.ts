import { Command, CommandRunner } from "@xieyuheng/command-line"
import ty from "@xieyuheng/ty"
import { serverOptionsFromCommandLineOptions } from "../../server/serverOptionsFromCommandLineOptions"
import { startSubdomainServer } from "../../servers/subdomain/startSubdomainServer"
import { changeLogger } from "../../utils/log"

type Args = { path: string }
type Opts = {
  hostname?: string
  port?: number
  "tls-cert"?: string
  "tls-key"?: string
  cors?: boolean
  "rewrite-not-found-to"?: string
  "cache-control-pattern"?: string | Array<string>
  logger?: string
}

export class ServeManyCommand extends Command<Args> {
  name = "serve-many"

  description = "Serve many websites using subdomain-based routing"

  args = { path: ty.string() }
  opts = {
    hostname: ty.optional(ty.string()),
    port: ty.optional(ty.number()),
    "tls-cert": ty.optional(ty.string()),
    "tls-key": ty.optional(ty.string()),
    cors: ty.optional(ty.boolean()),
    "rewrite-not-found-to": ty.optional(ty.string()),
    "cache-control-pattern": ty.optional(
      ty.union(ty.string(), ty.array(ty.string())),
    ),
    logger: ty.optional(ty.string()),
  }

  // prettier-ignore
  help(runner: CommandRunner): string {
    const { blue } = this.colors

    return [
      `The ${blue(this.name)} command takes a path to directory of websites,`,
      `and serve them using subdomain-based routing.`,
      ``,
      blue(`  ${runner.name} ${this.name} /websites`),
      ``,
    ].join("\n")
  }

  async execute(argv: Args & Opts): Promise<void> {
    if (argv.logger) {
      changeLogger(argv.logger)
    }

    const serverOptions = serverOptionsFromCommandLineOptions(argv)
    await startSubdomainServer(argv.path, serverOptions)
  }
}
