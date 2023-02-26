import { Event } from "../base/event";
import { Events } from "discord.js";
import MemberService from "../services/memberService";

/*
 *    Emitted whenever a user is updated (eg. new nickname/role change).
 */
export default new Event({
  name: Events.GuildMemberUpdate,
  async execute(oldMember, newMember) {
    const memberService = new MemberService();

    // [Logging]
    newMember.client.logger.logInfo(
      `${newMember.client.functions.getUserString(
        newMember.user
      )} has been updated in ${newMember.client.functions.getGuildString(
        newMember.guild
      )}.`
    );

    // [Database]: Update the database.
    await memberService.updateMember(newMember);
  },
});
