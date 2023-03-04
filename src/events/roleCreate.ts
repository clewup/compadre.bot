import { Event } from "../structures/event";
import { AuditLogEvent, EmbedBuilder, Events, Role } from "discord.js";

/**
 *    @name roleCreate
 *    @description Emitted whenever a role is created.
 */
export default new Event({
  name: Events.GuildRoleCreate,
  async execute(role) {
    role.client.logger.logInfo(
      `Role "${
        role.name
      }" has been created in ${role.client.functions.getGuildString(
        role.guild
      )}.`
    );

    const roleService = role.client.services.roleService;
    await roleService.createRole(role);

    await handleGuildLogging(role);
  },
});

const handleGuildLogging = async (role: Role) => {
  // Fetch the user who created the role
  const fetchedLogs = await role.guild.fetchAuditLogs({
    limit: 1,
    type: AuditLogEvent.RoleCreate,
  });
  const roleLog = fetchedLogs.entries.first();
  let createdBy = null;
  let reason = null;
  if (roleLog && roleLog.target?.id === role.id && roleLog.executor) {
    createdBy = roleLog.executor;
    reason = roleLog.reason;
  }

  const loggingService = role.client.services.loggingService;
  const embed = await loggingService.createLoggingEmbed("**Role Created**", [
    {
      name: "Role",
      value: `${role.name}`,
    },
    {
      name: "Created By",
      value: `${
        createdBy
          ? role.client.functions.getUserMentionString(createdBy)
          : "Unknown"
      }`,
    },
    {
      name: "Permissions",
      value: `${role.permissions.toJSON()}`,
    },
    {
      name: "Reason",
      value: `${reason ? reason : "Unknown"}`,
    },
  ]);
  await loggingService.sendLoggingMessage(role.guild, embed);
};
