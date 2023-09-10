import { Command, CommandRunner } from "@xieyuheng/command-line"
import ty from "@xieyuheng/ty"
import { dirname } from "node:path"
import { startWebsiteServer } from "../../servers/website/startWebsiteServer"
import { changeLogger } from "../../utils/log"
import { pathIsFile } from "../../utils/node/pathIsFile"
import { mergeWebsiteConfigs } from "../../website/mergeWebsiteConfigs"
import { readWebsiteConfigFile } from "../../website/readWebsiteConfigFile"
import { websiteConfigFromCommandLineOptions } from "../../website/websiteConfigFromCommandLineOptions"

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

    if (await pathIsFile(argv.path)) {
      const config = mergeWebsiteConfigs([
        await readWebsiteConfigFile(argv.path),
        websiteConfigFromCommandLineOptions(argv),
      ])
      const path = dirname(argv.path)
      await startWebsiteServer(path, config)
    } else {
      const config = websiteConfigFromCommandLineOptions(argv)
      const { path } = argv
      await startWebsiteServer(path, config)
    }
  }
}