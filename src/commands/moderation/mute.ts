import { Command } from "../../structures/command";
import {
  ChatInputCommandInteraction,
  PermissionsBitField,
  SlashCommandBuilder,
} from "discord.js";
import { Categories } from "../../data/enums/categories";
import { ErrorReasons } from "../../data/enums/reasons";

/**
 *    @name mute
 *    @description Mutes a user in the guild for a specified duration.
 *    The command requires a permission of MuteMembers.
 *    @param {User} user - The user to be muted.
 *    @param {number} duration - The duration of the mute.
 *    @param {string} [reason] - The reason for the user's mute.
 */
export default new Command({
  data: new SlashCommandBuilder()
    .setName("mute")
    .setDescription("Mute a user in the server.")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user to be be muted.")
        .setRequired(true)
    )
    .addNumberOption((option) =>
      option
        .setName("duration")
        .setDescription("How long the user is to be muted (minutes).")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("reason")
        .setDescription("The reason for the mute.")
        .setRequired(false)
    )
    .setDefaultMemberPermissions(PermissionsBitField.Flags.MuteMembers),

  details: {
    category: Categories.MODERATION,
    enabled: true,
  },

  async execute(interaction: ChatInputCommandInteraction<"cached">) {
    const user = interaction.options.getUser("user");
    const duration = interaction.options.getNumber("duration");
    const reason = interaction.options.getString("reason");

    if (!user) {
      return await interaction.reply({
        ephemeral: true,
        content: ErrorReasons.INVALID_USER,
      });
    }
    if (!duration) {
      return await interaction.reply({
        ephemeral: true,
        content: ErrorReasons.INVALID_PARAMETER("duration"),
      });
    }

    const memberToBeMuted = await interaction.guild.members.fetch(user.id);
    const memberMuting = interaction.member;

    if (memberToBeMuted.id === memberMuting.id) {
      return await interaction.reply({
        ephemeral: true,
        content: ErrorReasons.INVALID_USER_SELF,
      });
    }
    if (
      memberMuting.roles.highest.comparePositionTo(
        memberToBeMuted.roles.highest
      ) < 1
    ) {
      return await interaction.reply({
        ephemeral: true,
        content: ErrorReasons.INVALID_ROLE_HIERARCHY,
      });
    }

    const mutedUntil = new Date(new Date().getTime() + duration * 6000);
    await memberToBeMuted.disableCommunicationUntil(
      mutedUntil,
      reason ?? "No reason was provided."
    );

    await interaction.reply({
      ephemeral: true,
      content: `${user.username} has been muted.`,
    });
  },
});
