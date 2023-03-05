import { Event } from "../structures/event";
import { Colors, EmbedBuilder, Events, Guild, GuildMember } from "discord.js";
import { guildService, notificationService } from "../services";
import { functions, logger } from "../helpers";

/**
 *    @name guildCreate
 *    @description Emitted whenever the bot is added to a guild.
 */
export default new Event({
  name: Events.GuildCreate,
  async execute(guild) {
    logger.info(
      `${
        guild.client.user.username
      } has been added to ${functions.getGuildString(guild)}.`
    );

    const existingGuild = await guildService.get(guild);
    if (!existingGuild) {
      await guildService.create(guild);
    }
    if (
      existingGuild &&
      (existingGuild.name !== guild.name ||
        existingGuild.ownerId !== guild.ownerId ||
        existingGuild.memberCount !== guild.memberCount)
    ) {
      await guildService.update(guild);
    }

    await handleGuildNotification(guild);
  },
});

const handleGuildNotification = async (guild: Guild) => {
  const embed = new EmbedBuilder()
    .setColor(Colors.Red)
    .setTitle(`Hello! Thanks for adding me to ${guild.name}`)
    .setDescription("To get started, type '/help'.");

  await notificationService.send(guild, embed);
};
