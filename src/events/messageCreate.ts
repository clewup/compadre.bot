import { Event } from "../base/event";
import { Events } from "discord.js";
import User from "../models/user";
import UserManager from "../managers/userManager";

export default new Event({
  name: Events.MessageCreate,
  async execute(message) {
    const userManager = new UserManager();

    const user = await userManager.getUser(message.author.id);
    if (!user) {
      await userManager.createUser(message.author);
    }

    if (message.author.bot) return;
    if (message.content.startsWith("/")) return;
  },
});
