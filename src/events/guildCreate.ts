import { Event } from "../structures/event";
import { Colors, EmbedBuilder, Events, Guild, GuildMember } from "discord.js";

/**
 *    @name guildCreate
 *    @description Emitted whenever the bot is added to a guild.
 */
export default new Event({
  name: Events.GuildCreate,
  async execute(guild) {
    guild.client.logger.logInfo(
      `${
        guild.client.user.username
      } has been added to ${guild.client.functions.getGuildString(guild)}.`
    );

    const guildService = guild.client.services.guildService;
    const existingGuild = await guildService.getGuild(guild);
    if (!existingGuild) {
      await guildService.createGuild(guild);
    }
    if (
      existingGuild &&
      (existingGuild.name !== guild.name ||
        existingGuild.ownerId !== guild.ownerId ||
        existingGuild.memberCount !== guild.memberCount)
    ) {
      await guildService.updateGuild(guild);
    }

    await handleGuildNotification(guild);
  },
});

const handleGuildNotification = async (guild: Guild) => {
  const embed = new EmbedBuilder()
    .setColor(Colors.Red)
    .setTitle(`Hello! Thanks for adding me to ${guild.name}`)
    .setDescription("To get started, type '/help'.");

  const notificationService = guild.client.services.notificationService;
  await notificationService.sendNotificationMessage(guild, embed);
};
