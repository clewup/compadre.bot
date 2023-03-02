import { Command } from "../../structures/command";
import {
  ChatInputCommandInteraction,
  PermissionsBitField,
  SlashCommandBuilder,
} from "discord.js";
import {Categories} from "../../data/enums/categories";

/**
 *    @name ban
 *    @description Bans a user from the guild.
 *    The command requires a permission of BanMembers.
 *    @param {User} user - The user to be banned.
 *    @param {string} [reason] - The reason for the user's ban.
 */
export default new Command({
  data: new SlashCommandBuilder()
    .setName("ban")
    .setDescription("Ban a user from the server.")
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
    .setDefaultMemberPermissions(PermissionsBitField.Flags.BanMembers),

  details: {
    category: Categories.MODERATION,
  },

  async execute(interaction: ChatInputCommandInteraction<"cached">) {
    const user = interaction.options.getUser("user");
    const reason = interaction.options.getString("reason");

    if (!user) {
      return await interaction.reply({
        ephemeral: true,
        content: "Please provide a user to be banned.",
      });
    }

    const memberToBeBanned = await interaction.guild.members.fetch(user.id);
    const memberBanning = interaction.member;

    if (memberToBeBanned.id === memberBanning.id) {
      return await interaction.reply({
        ephemeral: true,
        content: "You cannot ban yourself.",
      });
    }
    if (
      memberBanning.roles.highest.comparePositionTo(
        memberToBeBanned.roles.highest
      ) < 1
    ) {
      return await interaction.reply({
        ephemeral: true,
        content: "You cannot ban someone with a higher role than yourself.",
      });
    }

    await memberToBeBanned.ban({
      reason: reason ?? "No reason was provided.",
    });

    await interaction.reply({
      ephemeral: true,
      content: `${user.username} has been banned.`,
    });
  },
});
