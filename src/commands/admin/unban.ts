import { Command } from "../../base/command";
import {
  ChatInputCommandInteraction,
  PermissionsBitField,
  SlashCommandBuilder,
  TextChannel,
  VoiceChannel,
} from "discord.js";

/*
 *    Unbans a user from the guild.
 *    <params="user (user), reason (string)"/>
 */
export default new Command({
  data: new SlashCommandBuilder()
    .setName("unban")
    .setDescription("Unban a user from the server.")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user to be be banned.")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("reason")
        .setDescription("The reason for the ban.")
        .setRequired(false)
    )
    .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator),

  async execute(interaction: ChatInputCommandInteraction<"cached">) {
    const user = interaction.options.getUser("user");
    const reason = interaction.options.getString("reason");

    if (!user) {
      return await interaction.reply({
        ephemeral: true,
        content: "Please provide a user to be unbanned.",
      });
    }

    const memberToBeUnbanned = await interaction.guild.members.fetch(user.id);
    const memberUnbanning = interaction.member;

    if (memberToBeUnbanned.id === memberUnbanning.id) {
      return await interaction.reply({
        ephemeral: true,
        content: "You cannot unban yourself.",
      });
    }
    if (
      memberUnbanning.roles.highest.comparePositionTo(
        memberToBeUnbanned.roles.highest
      ) < 1
    ) {
      return await interaction.reply({
        ephemeral: true,
        content: "You cannot unban someone with a higher role than yourself.",
      });
    }

    await interaction.guild.bans.remove(
      memberToBeUnbanned,
      reason ?? "No reason was provided."
    );

    await interaction.reply({
      ephemeral: true,
      content: `${user.username} has been unbanned.`,
    });
  },
});
