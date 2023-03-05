import WelcomeRepository from "../data/welcome.repository";
import { Guild as DiscordGuild } from "discord.js";
import { welcomeRepository } from "../data";

/**
 *    @class
 *    Creates a new instance of the WelcomeService.
 */
export default class WelcomeService {
  async get(guildId: string) {
    return await welcomeRepository.get(guildId);
  }

  async create(
    guild: DiscordGuild,
    channel: string | null,
    role: string | null,
    message: string | null,
    enabled: boolean
  ) {
    return await welcomeRepository.create(
      guild,
      channel,
      role,
      message,
      enabled
    );
  }

  async update(
    guild: DiscordGuild,
    channel: string | null,
    role: string | null,
    message: string | null,
    enabled: boolean
  ) {
    return await welcomeRepository.update(
      guild,
      channel,
      role,
      message,
      enabled
    );
  }

  async delete(guild: DiscordGuild) {
    await welcomeRepository.delete(guild);
  }
}
