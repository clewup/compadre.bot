import { Event } from "../base/event";
import { Events } from "discord.js";

/*
 *    Emitted whenever a role is created.
 */
export default new Event({
  name: Events.GuildRoleCreate,
  async execute(role) {},
});
