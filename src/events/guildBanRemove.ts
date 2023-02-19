import { Event } from "../base/event";
import { Colors, EmbedBuilder, Events, TextChannel } from "discord.js";

export default new Event({
  name: Events.GuildBanRemove,
  async execute(guildBan) {
    const embed = new EmbedBuilder()
      .setColor(Colors.Green)
      .setTitle(`${guildBan.user.username} has been unbanned from the server.`)
      .setThumbnail(guildBan.user.avatar);

    const generalChannel = guildBan.guild.channels.cache
      .filter((x) => (x as TextChannel).name === "general")
      .first() as TextChannel;
    await generalChannel?.send({ embeds: [embed] });
  },
});
