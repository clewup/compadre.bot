import { Command } from "../../structures/command";
import {
  ChatInputCommandInteraction,
  PermissionsBitField,
  SlashCommandBuilder,
  TextChannel,
  VoiceChannel,
} from "discord.js";

/*
 *    Mute a user in the guild.
 *    <params="user (user), reason (string)"/>
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
    .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator),

  details: {
    category: "Moderation",
  },

  async execute(interaction: ChatInputCommandInteraction<"cached">) {
    const user = interaction.options.getUser("user");
    const duration = interaction.options.getNumber("duration");
    const reason = interaction.options.getString("reason");

    if (!user) {
      return await interaction.reply({
        ephemeral: true,
        content: "Please provide a user to be muted.",
      });
    }
    if (!duration) {
      return await interaction.reply({
        ephemeral: true,
        content: "Please provide a duration.",
      });
    }

    const memberToBeMuted = await interaction.guild.members.fetch(user.id);
    const memberMuting = interaction.member;

    if (memberToBeMuted.id === memberMuting.id) {
      return await interaction.reply({
        ephemeral: true,
        content: "You cannot mute yourself.",
      });
    }
    if (
      memberMuting.roles.highest.comparePositionTo(
        memberToBeMuted.roles.highest
      ) < 1
    ) {
      return await interaction.reply({
        ephemeral: true,
        content: "You cannot mute someone with a higher role than yourself.",
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
