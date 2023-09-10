import { Command, CommandRunner } from "@xieyuheng/command-line"
import ty from "@xieyuheng/ty"
import { dirname } from "node:path"
import { createContext } from "../../handle/Context"
import { handleServe } from "../../handle/handleServe"
import { createRequestListener } from "../../server/createRequestListener"
import { startServer } from "../../server/startServer"
import { changeLogger, log } from "../../utils/log"
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

export class ServeCommand extends Command<Args> {
  name = "serve"

  description = "Serve a website"

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
      `The ${blue(this.name)} command takes a path`,
      `to a website directory or to a ${blue('website.json')} file,`,
      `and serve it as a website.`,
      ``,
      blue(`  ${runner.name} ${this.name} dist`),
      ``,
      blue(`  ${runner.name} ${this.name} dist/website.json`),
      ``,
    ].join("\n")
  }

  async execute(argv: Args & Opts): Promise<void> {
    if (argv.logger) {
      changeLogger(argv.logger)
    }

    const who = this.name

    if (await pathIsFile(argv.path)) {
      const websiteConfig = mergeWebsiteConfigs([
        await readWebsiteConfigFile(argv.path),
        websiteConfigFromCommandLineOptions(argv),
      ])

      log({ who, message: "create config", websiteConfig })

      const path = dirname(argv.path)
      const ctx = await createContext({ path, ...websiteConfig })

      log({ who, message: "create context", ctx })

      const { url } = await startServer(
        createRequestListener({ ctx, handle: handleServe }),
        websiteConfig,
      )

      log({ who, message: "start server", url: String(url) })
    } else {
      const websiteConfig = websiteConfigFromCommandLineOptions(argv)

      log({ who, message: "creaet config", websiteConfig })

      const { path } = argv
      const ctx = await createContext({ path, ...websiteConfig })

      log({ who, message: "create context", ctx })

      const { url } = await startServer(
        createRequestListener({ ctx, handle: handleServe }),
        websiteConfig,
      )

      log({ who, message: "startServer", url: String(url) })
    }
  }
}
