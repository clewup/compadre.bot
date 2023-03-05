import RoleRepository from "../data/role.repository";
import { Role as DiscordRole } from "discord.js";

/**
 *    @class
 *    Creates a new instance of the RoleService.
 */
export default class RoleService {
  private readonly repository: RoleRepository;

  constructor(repository: RoleRepository) {
    this.repository = repository;
  }

  async get(role: DiscordRole) {
    return await this.repository.get(role);
  }

  async create(role: DiscordRole) {
    return await this.repository.create(role);
  }

  async update(role: DiscordRole) {
    return await this.repository.update(role);
  }

  async delete(role: DiscordRole) {
    await this.repository.delete(role);
  }
}
