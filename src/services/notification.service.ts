import { TextChannel, Guild as DiscordGuild, EmbedBuilder } from "discord.js";
import { notificationRepository } from "../data";

/**
 *    @class
 *    Creates a new instance of the NotificationService.
 */
export default class NotificationService {
  async get(guildId: string) {
    return await notificationRepository.get(guildId);
  }

  async create(guild: DiscordGuild, channel: string | null, enabled: boolean) {
    return await notificationRepository.create(guild, channel, enabled);
  }

  async update(guild: DiscordGuild, channel: string | null, enabled: boolean) {
    return await notificationRepository.update(guild, channel, enabled);
  }

  async delete(guild: DiscordGuild) {
    await notificationRepository.delete(guild);
  }

  async getChannel(guild: DiscordGuild) {
    const config = await this.get(guild.id);

    if (config && config.channel) {
      const channel = await guild.channels.fetch(config.channel);

      if (channel instanceof TextChannel) {
        return channel;
      }
    }
  }

  async send(guild: DiscordGuild, embed: EmbedBuilder) {
    const config = await notificationRepository.get(guild.id);
    if (config?.enabled === true) {
      const channel = await this.getChannel(guild);

      if (!channel) return;

      await channel.send({ embeds: [embed] });
    }
  }
}
