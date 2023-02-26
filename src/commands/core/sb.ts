import { Command } from "../../structures/command";
import {
  ButtonStyle,
  ChatInputCommandInteraction,
  PermissionsBitField,
  SlashCommandBuilder,
} from "discord.js";

const soundEffects = [
  {
    name: "wow",
    value: "https://www.myinstants.com/media/sounds/anime-wow-sound-effect.mp3",
  },
  {
    name: "what da dog doin",
    value: "https://www.myinstants.com/media/sounds/yt1s_wU4BGgD.mp3",
  },
  {
    name: "phub",
    value: "https://www.myinstants.com/media/sounds/p-hub-intro.mp3",
  },
  {
    name: "fbi",
    value: "https://www.myinstants.com/media/sounds/fbi-open-up-sfx.mp3",
  },
  {
    name: "we got him",
    value:
      "https://www.myinstants.com/media/sounds/ladies-and-gentlemen-we-got-him-song.mp3",
  },
  {
    name: "avengers",
    value: "https://www.myinstants.com/media/sounds/avengers_.mp3",
  },
];

/*
 *    Plays a sound effect.
 */
export default new Command({
  data: new SlashCommandBuilder()
    .setName("sb")
    .setDescription("Play a sound effect.")
    .addStringOption((option) =>
      option
        .setName("effect")
        .setDescription("The sound effect.")
        .addChoices(...soundEffects)
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionsBitField.Flags.SendMessages),

  details: {
    category: "Core",
  },

  async execute(interaction: ChatInputCommandInteraction<"cached">) {
    const effect = interaction.options.getString("effect");

    if (!effect)
      return await interaction.reply({
        ephemeral: true,
        content: "Please provide a sound effect.",
      });

    await interaction.client.soundboard.playSoundEffect(interaction, effect);
    await interaction.reply({
      ephemeral: true,
      content: `${
        soundEffects.find((soundEffect) => soundEffect.value === effect)?.name
      }`,
    });
  },
});
