import { Event } from "../structures/event";
import { Events, Message } from "discord.js";
import { preventService } from "../services";
import { functions, logger } from "../helpers";

/**
 *    @name messageCreate
 *    @description Emitted whenever a message is created.
 */
export default new Event({
  name: Events.MessageCreate,
  async execute(message) {
    if (message.author.bot) return;
    if (message.content.startsWith("/")) return;

    logger.info(
      `${functions.getUserString(message.author)} has sent the message "${
        message.content
      }" in ${functions.getGuildString(message.guild!)}.`
    );

    await handlePrevent(message);
  },
});

const handlePrevent = async (message: Message<boolean>) => {
  if (message.guild) {
    const config = await preventService.get(message.guild.id);

    if (config && config.enabled) {
      const memberAuthor = await message.guild.members.fetch(message.author.id);
      const role = config.role
        ? await message.guild.roles.fetch(config.role)
        : null;

      if (
        !role ||
        (role && memberAuthor.roles.highest.comparePositionTo(role) < 1)
      ) {
        const linkExpression =
          /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi;
        const adExpression = /\b(?:.?)ad(?:.?)\b/;

        // Links
        if (config.links && message.content.match(new RegExp(linkExpression))) {
          await message.delete();
          logger.info(
            `"${message.content}" has been detected as containing a link and has been deleted.`
          );
          await message.channel.send({
            content: `${message.author} you do not have permission to send links.`,
          });
        }
      }
    }
  }
};
