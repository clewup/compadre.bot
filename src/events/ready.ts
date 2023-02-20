import { Event } from "../base/event";
import { Events } from "discord.js";
import GuildService from "../services/guildService";

export default new Event({
  name: Events.ClientReady,
  once: true,
  async execute(client) {
    const guildService = new GuildService();

    client.guilds.cache.map(async (guild) => {
      const existingGuild = await guildService.getGuild(guild.id);
      if (!existingGuild) {
        await guildService.createGuild({
          ...guild,
          joinedTimestamp: BigInt(guild.joinedTimestamp),
        });
      }
    });

    client.logger.logInfo(
      `${client.user?.username} is online and serving ${client.users.cache.size} user(s).`
    );
  },
});
