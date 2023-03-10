import { SlashCommandBuilder } from "discord.js";

interface CommandDetails {
  category: string;
  enabled: boolean;
}

interface CommandOptions {
  data: SlashCommandBuilder;
  details: CommandDetails;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  execute: (...args: any) => any;
}

/**
 *    @class
 *    Creates a new instance of Command.
 */
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
