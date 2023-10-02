import { Command, CommandRunner } from "@xieyuheng/command-line"
import ty from "@xieyuheng/ty"
import * as Commands from "."
import { packageJson } from "../../utils/node/packageJson"

type Args = {}
type Opts = { version?: boolean }

export class Default extends Command<Args, Opts> {
  name = "default"

  description = "Print help message"

  args = {}
  opts = { version: ty.optional(ty.boolean()) }
  alias = { version: ["v"] }

  async execute(argv: Args & Opts, runner: CommandRunner): Promise<void> {
    if (argv["version"]) {
      const { version } = packageJson()
      console.log(version)
      return
    }

    const command = new Commands.CommonHelp()
    await command.execute({}, runner)
  }
}
