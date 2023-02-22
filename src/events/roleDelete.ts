import { Event } from "../base/event";
import { Events } from "discord.js";

/*
 *    Emitted whenever a role is deleted.
 */
export default new Event({
  name: Events.GuildRoleDelete,
  async execute(role) {
    // [Logging]
    role.client.logger.logInfo(
      `Role "${
        role.name
      }" has been deleted in ${role.client.functions.getGuildString(
        role.guild
      )}.`
    );
  },
});
