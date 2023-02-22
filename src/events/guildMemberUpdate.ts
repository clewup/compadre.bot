import { Event } from "../base/event";
import { Events } from "discord.js";
import UserService from "../services/userService";

/*
 *    Emitted whenever a user is updated (eg. new nickname/role change).
 */
export default new Event({
  name: Events.GuildMemberUpdate,
  async execute(oldMember, newMember) {
    const userService = new UserService();

    // [Logging]
    newMember.client.logger.logInfo(
      `${newMember.client.functions.getUserString(
        newMember.user
      )} has been updated in ${newMember.client.functions.getGuildString(
        newMember.guild
      )}.`
    );

    // [Database]: Update the database.
    await userService.updateUser(newMember.user);
  },
});
