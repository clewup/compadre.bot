import { Event } from "../structures/event";
import { Events } from "discord.js";
import RoleService from "../services/roleService";

/*
 *    Emitted whenever a role is created.
 */
export default new Event({
  name: Events.GuildRoleCreate,
  async execute(role) {
    const roleService = new RoleService();

    // [Logging]
    role.client.logger.logInfo(
      `Role "${
        role.name
      }" has been created in ${role.client.functions.getGuildString(
        role.guild
      )}.`
    );

    // [Database]
    await roleService.createRole(role);
  },
});
