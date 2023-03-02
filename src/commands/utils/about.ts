import { Command } from "../../structures/command";
import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  PermissionsBitField,
  SlashCommandBuilder,
  version as discordJsVersion,
} from "discord.js";
import { readFileSync } from "fs";
import path from "node:path";
import {Categories} from "../../data/enums/categories";

/**
 *    @name about
 *    @description Returns information about the bot such as versions.
 *    The command requires a permission of SendMessages.
 */
export default new Command({
  data: new SlashCommandBuilder()
    .setName("about")
    .setDescription("View information about compadre.")
    .setDefaultMemberPermissions(PermissionsBitField.Flags.SendMessages),

  details: {
    category: Categories.UTILITIES,
  },

  async execute(interaction: ChatInputCommandInteraction<"cached">) {
    const packagePath = path.join(__dirname, "..", "..", "..", "package.json");
    const packageJson: { version: string } = JSON.parse(
      readFileSync(packagePath).toString()
    );

    const data = [
      `Serving ${interaction.client.guilds.cache.size} guilds.`,
      `Serving ${interaction.client.users.cache.size} users.`,
      `Serving ${interaction.client.channels.cache.size} channels.`,
      "",
      `Node Version ${process.versions.node}`,
      `DiscordJS Version ${discordJsVersion}`,
      `Bot Version ${packageJson.version}`,
    ];

    const embed = new EmbedBuilder()
      .setTitle(`${interaction.client.user.username} Information`)
      .setDescription(`${data.join("\n")}`);

    await interaction.reply({
      embeds: [embed],
    });
  },
});
