import { Event } from "../base/event";
import { Events, Message } from "discord.js";
import PreventConfigService from "../services/preventConfigService";
import { antiSpam } from "../lib/antispam/antispam";

/*
 *    Emitted whenever a message is created.
 */
export default new Event({
  name: Events.MessageCreate,
  async execute(message) {
    if (message.author.bot) return;
    if (message.content.startsWith("/")) return;

    // [Logging]
    message.client.logger.logInfo(
      `${message.client.functions.getUserString(
        message.author
      )} has sent the message "${
        message.content
      }" in ${message.client.functions.getGuildString(message.guild)}.`
    );

    // [Prevent]
    await handlePrevent(message);
  },
});

const handlePrevent = async (message: Message<boolean>) => {
  if (message.guild) {
    const preventConfigService = new PreventConfigService();
    const preventConfig = await preventConfigService.getPreventConfig(
      message.guild
    );

    if (preventConfig && preventConfig.enabled) {
      const memberAuthor = await message.guild.members.fetch(message.author.id);
      const role = preventConfig.role
        ? await message.guild.roles.fetch(preventConfig.role)
        : null;

      if (
        !role ||
        (role && memberAuthor.roles.highest.comparePositionTo(role) < 1)
      ) {
        const linkExpression =
          /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi;
        const adExpression = /\b(?:.?)ad(?:.?)\b/;

        // Links
        if (
          preventConfig.links &&
          message.content.match(new RegExp(linkExpression))
        ) {
          await message.delete();
          message.client.logger.logInfo(
            `"${message.content}" has been detected as containing a link and has been deleted.`
          );
        }

        // Spam
        if (preventConfig.spam) {
          await antiSpam.message(message);
          message.client.logger.logInfo(
            `"${message.content}" has been detected as spam and has been deleted.`
          );
        }

        // Ads
        if (
          preventConfig.ads &&
          message.content.match(new RegExp(adExpression))
        ) {
          await message.delete();
          message.client.logger.logInfo(
            `"${message.content}" has been detected as containing an advertisement and has been deleted.`
          );
        }
      }
    }
  }
};
