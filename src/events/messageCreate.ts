import { Event } from "../base/event";
import { Events } from "discord.js";
import UserService from "../services/userService";

export default new Event({
  name: Events.MessageCreate,
  async execute(message) {
    if (message.author.bot) return;
    if (message.content.startsWith("/")) return;
  },
});
