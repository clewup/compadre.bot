import WelcomeRepository from "../data/welcome.repository";
import { Guild as DiscordGuild } from "discord.js";

/**
 *    @class
 *    Creates a new instance of the WelcomeService.
 */
export default class WelcomeService {
  private readonly repository: WelcomeRepository;

  constructor(repository: WelcomeRepository) {
    this.repository = repository;
  }

  async get(guild: DiscordGuild) {
    return await this.repository.get(guild);
  }

  async create(
    guild: DiscordGuild,
    channel: string | null,
    role: string | null,
    message: string | null,
    enabled: boolean
  ) {
    return await this.repository.create(guild, channel, role, message, enabled);
  }

  async update(
    guild: DiscordGuild,
    channel: string | null,
    role: string | null,
    message: string | null,
    enabled: boolean
  ) {
    return await this.repository.update(guild, channel, role, message, enabled);
  }

  async delete(guild: DiscordGuild) {
    await this.repository.delete(guild);
  }
}
