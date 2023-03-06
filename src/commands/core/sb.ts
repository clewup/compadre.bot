import { Command } from "../../structures/command";
import {
  ChatInputCommandInteraction,
  PermissionsBitField,
  SlashCommandBuilder,
} from "discord.js";
import { SoundEffects } from "../../enums/soundEffects";
import { Categories } from "../../enums/categories";
import { ErrorReasons } from "../../enums/reasons";

/**
 *    @name sb
 *    @description Plays a sound effect in the channel the command is executed.
 *    The command requires a permission of SendMessages.
 *    @param {string} effect - A specified sound effect listed in the soundEffects array.
 */
export default new Command({
  data: new SlashCommandBuilder()
    .setName("sb")
    .setDescription("Play a sound effect in the channel.")
    .addStringOption((option) =>
      option
        .setName("effect")
        .setDescription("The specified sound effect.")
        .addChoices(...SoundEffects)
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionsBitField.Flags.SendMessages),

  details: {
    category: Categories.CORE,
    enabled: false,
  },

  async execute(interaction: ChatInputCommandInteraction<"cached">) {
    const effect = interaction.options.getString("effect");

    if (!effect)
      return await interaction.reply({
        ephemeral: true,
        content: ErrorReasons.INVALID_PARAMETER("sound effect"),
      });

    await interaction.client.soundboard.playSoundEffect(interaction, effect);
    await interaction.reply({
      ephemeral: true,
      content: `${
        SoundEffects.find((soundEffect) => soundEffect.value === effect)?.name
      }`,
    });
  },
});
