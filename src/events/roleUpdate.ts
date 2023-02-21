import { Event } from "../base/event";
import { Events } from "discord.js";

/*
 *    Emitted whenever a role is updated.
 */
export default new Event({
  name: Events.GuildRoleUpdate,
  async execute(role) {},
});
