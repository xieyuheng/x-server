import { Command, CommandRunner } from "@xieyuheng/command-line"
import ty from "@xieyuheng/ty"
import { dirname } from "node:path"
import { startServer } from "../../servers/subdomain/startServer"
import { LoggerName, LoggerNameSchema, changeLogger } from "../../utils/log"
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
  "redirect-not-found-to"?: string
  "cache-control-pattern"?: string | Array<string>
  "logger-name"?: LoggerName
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
    "redirect-not-found-to": ty.optional(ty.string()),
    "cache-control-pattern": ty.optional(
      ty.union(ty.string(), ty.array(ty.string())),
    ),
    "logger-name": ty.optional(LoggerNameSchema),
  }

  // prettier-ignore
  help(runner: CommandRunner): string {
    const { blue } = this.colors

    return [
      `The ${blue(this.name)} command takes a website.json config file,`,
      `and serve the directory that contains the config file`,
      `using subdomain-based routing.`,
      ``,
      blue(`  ${runner.name} ${this.name} /websites/website.json`),
      ``,
    ].join("\n")
  }

  async execute(argv: Args & Opts): Promise<void> {
    changeLogger(argv["logger-name"] || "pretty-line")

    if (await pathIsFile(argv.path)) {
      const config = mergeWebsiteConfigs([
        await readWebsiteConfigFile(argv.path),
        websiteConfigFromCommandLineOptions(argv),
      ])

      const path = dirname(argv.path)
      await startServer(path, config)
    } else {
      const config = websiteConfigFromCommandLineOptions(argv)
      const { path } = argv
      await startServer(path, config)
    }
  }
}
