import { Guild as DiscordGuild } from "discord.js";
import PreventRepository from "../data/prevent.repository";

/**
 *    @class
 *    Creates a new instance of the PreventService.
 */
export default class PreventService {
  private readonly repository: PreventRepository;

  constructor(repository: PreventRepository) {
    this.repository = repository;
  }

  async get(guild: DiscordGuild) {
    return await this.repository.get(guild);
  }

  async create(
    guild: DiscordGuild,
    role: string | null,
    links: boolean,
    enabled: boolean
  ) {
    return await this.repository.create(guild, role, links, enabled);
  }

  async update(
    guild: DiscordGuild,
    role: string | null,
    links: boolean,
    enabled: boolean
  ) {
    return await this.repository.update(guild, role, links, enabled);
  }

  async delete(guild: DiscordGuild) {
    await this.repository.delete(guild);
  }
}
