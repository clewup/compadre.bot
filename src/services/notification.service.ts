import Database from "../structures/database";
import { TextChannel, Guild as DiscordGuild, EmbedBuilder } from "discord.js";
import NotificationRepository from "../data/notification.repository";
import GuildRepository from "../data/guild.repository";

/**
 *    @class
 *    Creates a new instance of the NotificationService.
 */
export default class NotificationService {
  private readonly repository: NotificationRepository;

  constructor(repository: NotificationRepository) {
    this.repository = repository;
  }

  async get(guild: DiscordGuild) {
    return await this.repository.get(guild);
  }

  async create(guild: DiscordGuild, channel: string | null, enabled: boolean) {
    return await this.repository.create(guild, channel, enabled);
  }

  async update(guild: DiscordGuild, channel: string | null, enabled: boolean) {
    return await this.repository.update(guild, channel, enabled);
  }

  async delete(guild: DiscordGuild) {
    await this.repository.delete(guild);
  }

  async getChannel(guild: DiscordGuild) {
    const config = await this.repository.get(guild);

    if (config && config.channel) {
      const channel = await guild.channels.fetch(config.channel);

      if (channel instanceof TextChannel) {
        return channel;
      }
    }
  }

  async send(guild: DiscordGuild, embed: EmbedBuilder) {
    const config = await this.repository.get(guild);
    if (config?.enabled === true) {
      const channel = await this.getChannel(guild);

      await channel!.send({ embeds: [embed] });
    }
  }
}
