import { Command } from "../../base/command";
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

export default new Command({
  data: new SlashCommandBuilder()
    .setName("invite")
    .setDescription("Generate a bot invite.")
    .setDefaultMemberPermissions(PermissionsBitField.Flags.SendMessages),

  async execute(interaction: ChatInputCommandInteraction<"cached">) {
    const inviteLink = `https://discord.com/api/oauth2/authorize?client_id=1075167615602933760&permissions=8&scope=bot%20applications.commands`;
    const button = new ButtonBuilder()
      .setLabel("Click here!")
      .setStyle(ButtonStyle.Link)
      .setURL(inviteLink);

    const actionRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
      button
    );

    await interaction.reply({
      ephemeral: true,
      components: [actionRow],
    });
  },
});
