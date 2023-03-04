import { Event } from "../structures/event";
import { AuditLogEvent, EmbedBuilder, Events, Role } from "discord.js";

/**
 *    @name roleDelete
 *    @description Emitted whenever a role is deleted.
 */
export default new Event({
  name: Events.GuildRoleDelete,
  async execute(role) {
    role.client.logger.logInfo(
      `Role "${
        role.name
      }" has been deleted in ${role.client.functions.getGuildString(
        role.guild
      )}.`
    );

    const roleService = role.client.services.roleService;
    await roleService.deleteRole(role);

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

  const loggingService = role.client.services.loggingService;
  const embed = await loggingService.createLoggingEmbed("**Role Deleted**", [
    {
      name: "Role",
      value: `${role.name}`,
    },
    {
      name: "Deleted By",
      value: `${
        deletedBy
          ? role.client.functions.getUserMentionString(deletedBy)
          : "Unknown"
      }`,
    },
    {
      name: "Reason",
      value: `${reason ? reason : "Unknown"}`,
    },
  ]);
  await loggingService.sendLoggingMessage(role.guild, embed);
};
