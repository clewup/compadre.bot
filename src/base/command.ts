import {
  SlashCommandBuilder,
  ContextMenuCommandBuilder,
  PermissionResolvable,
} from "discord.js";

interface CommandOptions {
  data: SlashCommandBuilder | ContextMenuCommandBuilder;
  execute: (...args: any) => any;
}

export class Command {
  data: CommandOptions["data"];
  execute: CommandOptions["execute"];

  constructor(options: CommandOptions) {
    this.data = options.data;
    this.execute = options.execute;
  }
}
