import { Event } from "../base/event";
import { Colors, Embed, EmbedBuilder, Events, TextChannel } from "discord.js";

export default new Event({
  name: Events.GuildMemberRemove,
  async execute(member) {
    const embed = new EmbedBuilder()
      .setColor(Colors.Red)
      .setTitle(`${member.displayName} has left the server.`)
      .setThumbnail(member.avatar);

    const generalChannel = member.guild.channels.cache
      .filter((x) => (x as TextChannel).name === "general")
      .first() as TextChannel;
    await generalChannel?.send({ embeds: [embed] });
  },
});
