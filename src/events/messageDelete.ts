import { Event } from "../structures/event";
import {
  AuditLogEvent,
  CommandInteraction,
  EmbedBuilder,
  Events,
  Message,
  PartialMessage,
} from "discord.js";
import { loggingService } from "../services";
import { functions, logger } from "../helpers";

/**
 *    @name messageDelete
 *    @description Emitted whenever a message is deleted.
 */
export default new Event({
  name: Events.MessageDelete,
  async execute(message) {
    if (message.author?.bot) return;
    if (message.content?.startsWith("/")) return;
    if (!message.guild) return;

    logger.info(
      `The message "${
        message.content || message.embeds[0].title || "Unknown"
      }" has been deleted in ${functions.getGuildString(message.guild)}.`
    );

    await handleGuildLogging(message);
  },
});

const handleGuildLogging = async (message: Message | PartialMessage) => {
  // Fetch the user who deleted the message
  const fetchedLogs = await message.guild!.fetchAuditLogs({
    limit: 1,
    type: AuditLogEvent.MessageDelete,
  });
  const deletionLog = fetchedLogs.entries.first();
  let deletedBy = null;
  if (
    deletionLog &&
    deletionLog.target.id === message.author?.id &&
    deletionLog.executor
  ) {
    deletedBy = deletionLog.executor;
  }

  const embed = await loggingService.createEmbed("**Message Deleted**", [
    {
      name: "Author",
      value: `${
        message.author
          ? message.client.functions.getUserMentionString(message.author)
          : "Unknown"
      }`,
      inline: false,
    },
    {
      name: "Channel",
      value: `${message.channel}`,
      inline: false,
    },
    {
      name: "Message",
      value: `${message.content || message.embeds[0]?.title || "Unknown"}`,
      inline: false,
    },
    {
      name: "Deleted By",
      value: deletedBy
        ? message.client.functions.getUserMentionString(deletedBy)
        : "Unknown",
      inline: false,
    },
  ]);
  await loggingService.send(message.guild!, embed);
};
