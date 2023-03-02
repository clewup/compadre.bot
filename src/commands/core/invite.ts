import { Command } from "../../structures/command";
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChatInputCommandInteraction,
  PermissionsBitField,
  SlashCommandBuilder,
} from "discord.js";
import config from "../../config";
import {Categories} from "../../data/enums/categories";

/**
 *    @name invite
 *    @description Generates an invitation link for the bot.
 *    The command requires a permission of SendMessages.
 */
export default new Command({
  data: new SlashCommandBuilder()
    .setName("invite")
    .setDescription("Generate an invitation link for the bot.")
    .setDefaultMemberPermissions(PermissionsBitField.Flags.SendMessages),

  details: {
    category: Categories.CORE,
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
