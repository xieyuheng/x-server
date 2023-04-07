import { Command, CommandRunner } from "@xieyuheng/command-line"
import ty from "@xieyuheng/ty"
import { packageJson } from "../../utils/node/packageJson"
import * as Commands from "../commands"

type Args = {}
type Opts = { version?: boolean }

export class DefaultCommand extends Command<Args, Opts> {
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

    const command = new Commands.CommonHelpCommand()
    await command.execute({}, runner)
  }
}
