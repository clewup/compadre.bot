import {
  TextChannel,
  Guild as DiscordGuild,
  EmbedField,
  EmbedBuilder,
} from "discord.js";
import LoggingRepository from "../data/logging.repository";

/**
 *    @class
 *    Creates a new instance of the LoggingService.
 */
export default class LoggingService {
  private readonly repository: LoggingRepository;

  constructor(repository: LoggingRepository) {
    this.repository = repository;
  }

  async get(guild: DiscordGuild) {
    return this.repository.get(guild);
  }

  async create(
    guild: DiscordGuild,
    role: string | null,
    channel: string | null,
    enabled: boolean
  ) {
    return this.repository.create(guild, role, channel, enabled);
  }

  async update(
    guild: DiscordGuild,
    role: string | null,
    channel: string | null,
    enabled: boolean
  ) {
    return this.repository.update(guild, role, channel, enabled);
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

  createEmbed(title: string, fields: EmbedField[]): EmbedBuilder {
    return new EmbedBuilder()
      .setTitle(title)
      .setFields(fields)
      .setFooter({ text: `${new Date().toISOString()}` });
  }

  async send(guild: DiscordGuild, embed: EmbedBuilder) {
    const config = await this.repository.get(guild);

    if (config?.enabled === true) {
      const channel = await this.getChannel(guild);
      await channel?.send({
        embeds: [embed],
      });
    }
  }
}
