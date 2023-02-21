import { Event } from "../base/event";
import { Events } from "discord.js";

/*
 *    Emitted whenever a role is deleted.
 */
export default new Event({
  name: Events.GuildRoleDelete,
  async execute(role) {},
});
