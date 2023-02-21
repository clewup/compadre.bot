import { Event } from "../base/event";
import { Colors, Embed, EmbedBuilder, Events, TextChannel } from "discord.js";
import GuildService from "../services/guildService";
import UserService from "../services/userService";

/*
 *    Emitted whenever a user joins a guild.
 *    Creates the user in the database.
 */
export default new Event({
  name: Events.GuildMemberAdd,
  async execute(member) {
    const guildService = new GuildService();
    const userService = new UserService();

    const embed = new EmbedBuilder()
      .setColor(Colors.Green)
      .setTitle(`${member.displayName} has joined the server.`)
      .setThumbnail(member.avatar);

    await userService.createUser(member.user);

    const notificationChannel = await guildService.getNotificationChannel(
      member.guild
    );
    await notificationChannel.send({ embeds: [embed] });
  },
});
