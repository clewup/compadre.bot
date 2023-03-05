import RoleRepository from "../data/role.repository";
import { Role as DiscordRole } from "discord.js";
import { roleRepository } from "../data";

/**
 *    @class
 *    Creates a new instance of the RoleService.
 */
export default class RoleService {
  async getAll(guildId: string) {
    return await roleRepository.getAll(guildId);
  }

  async get(id: string) {
    return await roleRepository.get(id);
  }

  async create(role: DiscordRole) {
    return await roleRepository.create(role);
  }

  async update(role: DiscordRole) {
    return await roleRepository.update(role);
  }

  async delete(role: DiscordRole) {
    await roleRepository.delete(role);
  }
}
