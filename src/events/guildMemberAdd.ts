import { Event } from "../base/event";
import { Colors, Embed, EmbedBuilder, Events, TextChannel } from "discord.js";
import GuildService from "../services/guildService";

export default new Event({
  name: Events.GuildMemberAdd,
  async execute(member) {
    const guildService = new GuildService();

    const embed = new EmbedBuilder()
      .setColor(Colors.Green)
      .setTitle(`${member.displayName} has joined the server.`)
      .setThumbnail(member.avatar);

    const notificationChannel = await guildService.getNotificationChannel(
      member.guild
    );
    await notificationChannel.send({ embeds: [embed] });
  },
});
