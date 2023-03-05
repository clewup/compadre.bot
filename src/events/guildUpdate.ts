import { Event } from "../structures/event";
import { Events } from "discord.js";
import { guildService } from "../services";
import { logger } from "../helpers";

/**
 *    @name guildUpdate
 *    @description Emitted whenever a guild is updated (eg. name change).
 */
export default new Event({
  name: Events.GuildUpdate,
  async execute(guild) {
    logger.info(
      `${guild.client.functions.getGuildString(guild)} has been updated.`
    );

    await guildService.update(guild);
  },
});
