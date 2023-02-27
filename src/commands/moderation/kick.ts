import { Command } from "../../structures/command";
import {
  ChatInputCommandInteraction,
  PermissionsBitField,
  SlashCommandBuilder,
} from "discord.js";

/**
 *    @name kick
 *    @description Kicks a user from the guild.
 *    The command requires a permission of KickMembers.
 *    @param {User} user - The user to be kicked.
 *    @param {string} [reason] - The reason for the user's kick.
 */
export default new Command({
  data: new SlashCommandBuilder()
    .setName("kick")
    .setDescription("Kick a user from the server.")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user to be be kicked.")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("reason")
        .setDescription("The reason for the kick.")
        .setRequired(false)
    )
    .setDefaultMemberPermissions(PermissionsBitField.Flags.KickMembers),

  details: {
    category: "Moderation",
  },

  async execute(interaction: ChatInputCommandInteraction<"cached">) {
    const user = interaction.options.getUser("user");
    const reason = interaction.options.getString("reason");

    if (!user) {
      return await interaction.reply({
        ephemeral: true,
        content: "Please provide a user to be kicked.",
      });
    }

    const memberToBeKicked = await interaction.guild.members.fetch(user.id);
    const memberKicking = interaction.member;

    if (memberToBeKicked.id === memberKicking.id) {
      return await interaction.reply({
        ephemeral: true,
        content: "You cannot kick yourself.",
      });
    }
    if (
      memberKicking.roles.highest.comparePositionTo(
        memberToBeKicked.roles.highest
      ) > 1
    ) {
      return await interaction.reply({
        ephemeral: true,
        content: "You cannot kick someone with a higher role than yourself.",
      });
    }

    await memberToBeKicked.kick(reason ?? "No reason was provided.");

    await interaction.reply({
      ephemeral: true,
      content: `${user.username} has been kicked.`,
    });
  },
});
