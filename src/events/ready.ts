import { Event } from "../base/event";
import { Events } from "discord.js";
import Botty from "../base/botty";

export default new Event({
  name: Events.ClientReady,
  once: true,
  async execute(client) {
    (client as Botty).logger.logInfo(
      `${client.user.username} is online and serving ${client.users.cache.size} user(s).`
    );

    client.users.cache.map((guild) => {
      return (client as Botty).logger.log(`${guild.id} ✅`);
    });
  },
});
