import { CommandRunner, CommandRunners } from "@xieyuheng/command-line"
import * as Commands from "./commands"

export function createCommandRunner(): CommandRunner {
  return new CommandRunners.CommonCommandRunner({
    defaultCommand: new Commands.DefaultCommand(),
    commands: [
      new Commands.CommonHelpCommand(),
      new Commands.DatabaseServeCommand(),
      new Commands.DatabaseImportDatasetCommand(),
      new Commands.WebsiteServeCommand(),
      new Commands.ReverseProxyServeCommand(),
      new Commands.ReverseProxyConnectCommand(),
      new Commands.ReverseProxyLoginCommand(),
      new Commands.ReverseProxyLogoutCommand(),
      new Commands.ReverseProxyWhoamiCommand(),
    ],
  })
}
