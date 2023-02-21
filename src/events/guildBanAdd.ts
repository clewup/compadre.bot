import { Event } from "../base/event";
import { Colors, EmbedBuilder, Events, TextChannel } from "discord.js";
import GuildService from "../services/guildService";

/*
 *    Emitted whenever a user is banned from a guild.
 */
export default new Event({
  name: Events.GuildBanAdd,
  async execute(guildBan) {
    const guildService = new GuildService();

    const embed = new EmbedBuilder()
      .setColor(Colors.Red)
      .setTitle(`${guildBan.user.username} has been banned from the server.`)
      .setThumbnail(guildBan.user.avatar);

    // Send the message to the guild's selected notification channel
    const notificationChannel = await guildService.getNotificationChannel(
      guildBan.guild
    );
    await notificationChannel.send({ embeds: [embed] });
  },
});
