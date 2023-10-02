import { CommandRunner, CommandRunners } from "@xieyuheng/command-line"
import * as Commands from "./commands"

export function createCommandRunner(): CommandRunner {
  return new CommandRunners.CommonCommandRunner({
    defaultCommand: new Commands.Default(),
    commands: [
      new Commands.CommonHelp(),
      new Commands.ServeWebsite(),
      new Commands.ServeSubdomain(),
    ],
  })
}
