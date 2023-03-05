import {
  TextChannel,
  Guild as DiscordGuild,
  EmbedField,
  EmbedBuilder,
} from "discord.js";
import { loggingRepository } from "../data";
import LoggingRepository from "../data/logging.repository";

/**
 *    @class
 *    Creates a new instance of the LoggingService.
 */
export default class LoggingService {
  async get(guildId: string) {
    return loggingRepository.get(guildId);
  }

  async create(
    guild: DiscordGuild,
    role: string | null,
    channel: string | null,
    enabled: boolean
  ) {
    return loggingRepository.create(guild, role, channel, enabled);
  }

  async update(
    guild: DiscordGuild,
    role: string | null,
    channel: string | null,
    enabled: boolean
  ) {
    return loggingRepository.update(guild, role, channel, enabled);
  }

  async delete(guild: DiscordGuild) {
    await loggingRepository.delete(guild);
  }

  async getChannel(guild: DiscordGuild) {
    const config = await loggingRepository.get(guild.id);

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
    const config = await loggingRepository.get(guild.id);

    if (config?.enabled === true) {
      const channel = await this.getChannel(guild);
      await channel?.send({
        embeds: [embed],
      });
    }
  }
}
