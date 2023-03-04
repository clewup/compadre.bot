import { Event } from "../structures/event";
import { AuditLogEvent, EmbedBuilder, Events, Role } from "discord.js";

/**
 *    @name roleUpdate
 *    @description Emitted whenever a role is updated.
 */
export default new Event({
  name: Events.GuildRoleUpdate,
  async execute(role) {
    role.client.logger.logInfo(
      `Role "${
        role.name
      }" has been updated in ${role.client.functions.getGuildString(
        role.guild
      )}.`
    );

    const roleService = role.client.services.roleService;
    await roleService.updateRole(role);

    await handleGuildLogging(role);
  },
});

const handleGuildLogging = async (role: Role) => {
  // Fetch the user who updated the role
  const fetchedLogs = await role.guild.fetchAuditLogs({
    limit: 1,
    type: AuditLogEvent.RoleUpdate,
  });
  const roleLog = fetchedLogs.entries.first();
  let updatedBy = null;
  if (roleLog && roleLog.target?.id === role.id && roleLog.executor) {
    updatedBy = roleLog.executor;
  }

  const loggingService = role.client.services.loggingService;
  const embed = await loggingService.createLoggingEmbed("**Role Updated**", [
    {
      name: "Role",
      value: `${role.name}`,
    },
    {
      name: "Updated By",
      value: `${
        updatedBy ? role.client.functions.getUserString(updatedBy) : "Unknown"
      }`,
    },
  ]);
  await loggingService.sendLoggingMessage(role.guild, embed);
};
