import { CommandInteraction, ChatInputApplicationCommandData } from "discord.js";
import Botty from "../base/botty";

export interface ICommand extends ChatInputApplicationCommandData {
    run: (client: Botty, interaction: CommandInteraction) => void;
}