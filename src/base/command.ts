import { SlashCommandBuilder, ContextMenuCommandBuilder } from "discord.js";

interface CommandDetails {
  category: string;
}

interface CommandOptions {
  data: SlashCommandBuilder;
  details: CommandDetails;
  execute: (...args: any) => any;
}

export class Command {
  data: CommandOptions["data"];
  details: CommandOptions["details"];
  execute: CommandOptions["execute"];

  constructor(options: CommandOptions) {
    this.data = options.data;
    this.details = options.details;
    this.execute = options.execute;
  }
}
