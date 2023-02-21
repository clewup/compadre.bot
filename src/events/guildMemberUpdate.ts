import { Event } from "../base/event";
import { Events } from "discord.js";
import UserService from "../services/userService";

export default new Event({
  name: Events.GuildMemberUpdate,
  async execute(oldMember, newMember) {
    const userService = new UserService();

    await userService.updateUser(newMember.user);
  },
});
