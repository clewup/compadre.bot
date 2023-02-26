import { Event } from "../structures/event";
import { Events } from "discord.js";
import RoleService from "../services/roleService";

/*
 *    Emitted whenever a role is updated.
 */
export default new Event({
  name: Events.GuildRoleUpdate,
  async execute(role) {
    const roleService = new RoleService();

    // [Logging]
    role.client.logger.logInfo(
      `Role "${
        role.name
      }" has been updated in ${role.client.functions.getGuildString(
        role.guild
      )}.`
    );

    // [Database]
    await roleService.updateRole(role);
  },
});
