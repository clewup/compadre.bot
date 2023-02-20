import { Event } from "../base/event";
import { Events } from "discord.js";
import UserService from "../services/userService";

export default new Event({
  name: Events.MessageCreate,
  async execute(message) {
    const userService = new UserService();

    const existingUser = await userService.getUser(message.author.id);
    if (!existingUser) {
      await userService.createUser({ ...message.author, clientAdmin: false });
    }

    if (message.author.bot) return;
    if (message.content.startsWith("/")) return;
  },
});
