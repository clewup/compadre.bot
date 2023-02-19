import { Event } from "../base/event";
import { Colors, Embed, EmbedBuilder, Events, TextChannel } from "discord.js";

export default new Event({
  name: Events.GuildMemberAdd,
  async execute(member) {
    const embed = new EmbedBuilder()
      .setColor(Colors.Green)
      .setTitle(`${member.displayName} has joined the server.`)
      .setThumbnail(member.avatar);

    const generalChannel = member.guild.channels.cache
      .filter((x) => (x as TextChannel).name === "general")
      .first() as TextChannel;
    await generalChannel?.send({ embeds: [embed] });
  },
});
