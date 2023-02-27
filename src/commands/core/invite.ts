import { Command } from "../../structures/command";
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChatInputCommandInteraction,
  Colors,
  EmbedBuilder,
  PermissionsBitField,
  SlashCommandBuilder,
} from "discord.js";
import config from "../../config";

/*
 *    Generates an invite link for the bot.
 */
export default new Command({
  data: new SlashCommandBuilder()
    .setName("invite")
    .setDescription("Generate a bot invite.")
    .setDefaultMemberPermissions(PermissionsBitField.Flags.SendMessages),

  details: {
    category: "Core",
  },

  async execute(interaction: ChatInputCommandInteraction<"cached">) {
    const inviteLink = config.clientInviteUrl;
    const button = new ButtonBuilder()
      .setLabel("Click here!")
      .setStyle(ButtonStyle.Link)
      .setURL(inviteLink || "");

    const actionRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
      button
    );

    await interaction.reply({
      ephemeral: true,
      components: [actionRow],
    });
  },
});
