import { Event } from "../structures/event";
import { AuditLogEvent, EmbedBuilder, Events, Role } from "discord.js";
import { loggingService, roleService } from "../services";
import { functions, logger } from "../helpers";

/**
 *    @name roleDelete
 *    @description Emitted whenever a role is deleted.
 */
export default new Event({
  name: Events.GuildRoleDelete,
  async execute(role) {
    logger.info(
      `Role "${role.name}" has been deleted in ${functions.getGuildString(
        role.guild
      )}.`
    );

    await roleService.delete(role);

    await handleGuildLogging(role);
  },
});

const handleGuildLogging = async (role: Role) => {
  // Fetch the user who deleted the role
  const fetchedLogs = await role.guild.fetchAuditLogs({
    limit: 1,
    type: AuditLogEvent.RoleDelete,
  });
  const roleLog = fetchedLogs.entries.first();
  let deletedBy = null;
  let reason = null;
  if (roleLog && roleLog.target?.id === role.id && roleLog.executor) {
    deletedBy = roleLog.executor;
    reason = roleLog.reason;
  }

  const embed = await loggingService.createEmbed("**Role Deleted**", [
    {
      name: "Role",
      value: `${role.name}`,
      inline: false,
    },
    {
      name: "Deleted By",
      value: `${
        deletedBy ? functions.getUserMentionString(deletedBy) : "Unknown"
      }`,
      inline: false,
    },
    {
      name: "Reason",
      value: `${reason ? reason : "Unknown"}`,
      inline: false,
    },
  ]);
  await loggingService.send(role.guild, embed);
};
