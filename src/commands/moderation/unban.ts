import { Command } from "../../structures/command";
import {
  ChatInputCommandInteraction,
  PermissionsBitField,
  SlashCommandBuilder,
} from "discord.js";

/**
 *    @name unban
 *    @description Unbans a user from the guild.
 *    The command requires a permission of Administrator.
 *    @param {User} user - The user to be unbanned.
 *    @param {string} [reason] - The reason for the user's ban.
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

  details: {
    category: "Moderation",
  },

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
