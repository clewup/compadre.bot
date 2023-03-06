import { Guild as DiscordGuild } from "discord.js";
import { preventRepository } from "../data";

/**
 *    @class
 *    Creates a new instance of the PreventService.
 */
export default class PreventService {
  async get(guildId: string) {
    return await preventRepository.get(guildId);
  }

  async create(
    guild: DiscordGuild,
    role: string | null,
    links: boolean,
    enabled: boolean
  ) {
    return await preventRepository.create(guild, role, links, enabled);
  }

  async update(
    guild: DiscordGuild,
    role: string | null,
    links: boolean,
    enabled: boolean
  ) {
    return await preventRepository.update(guild, role, links, enabled);
  }

  async delete(guild: DiscordGuild) {
    await preventRepository.delete(guild);
  }
}
