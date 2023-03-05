import { Event } from "../structures/event";
import { Events } from "discord.js";
import { guildService } from "../services";
import { logger } from "../helpers";

/**
 *    @name guildDelete
 *    @description Emitted whenever the bot is removed from a guild.
 */
export default new Event({
  name: Events.GuildDelete,
  async execute(guild) {
    logger.info(
      `${
        guild.client.user.username
      } has been removed from ${guild.client.functions.getGuildString(guild)}.`
    );

    await guildService.delete(guild);
  },
});
