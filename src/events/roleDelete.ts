import { Event } from "../structures/event";
import { AuditLogEvent, EmbedBuilder, Events, Role } from "discord.js";
import RoleService from "../services/roleService";
import LoggingService from "../services/loggingService";

/**
 *    @name roleDelete
 *    @description Emitted whenever a role is deleted.
 */
export default new Event({
  name: Events.GuildRoleDelete,
  async execute(role) {
    const roleService = new RoleService();

    // [Logging]
    role.client.logger.logInfo(
      `Role "${
        role.name
      }" has been deleted in ${role.client.functions.getGuildString(
        role.guild
      )}.`
    );

    // [GuildLogging]
    await handleGuildLogging(role);

    // [Database]
    await roleService.deleteRole(role);
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
  if (roleLog && roleLog.target?.id === role.id && roleLog.executor) {
    deletedBy = roleLog.executor;
  }

  // Create the embed
  const loggingEmbed = new EmbedBuilder()
    .setTitle("**Deleted Role**")
    .addFields([
      {
        name: "Role",
        value: `${role.name}`,
      },
      {
        name: "Deleted By",
        value: `${
          deletedBy ? role.client.functions.getUserString(deletedBy) : "Unknown"
        }`,
      },
    ])
    .setFooter({ text: `${new Date().toISOString()}` });

  // Send the logs
  const loggingService = new LoggingService();
  const loggingConfig = await loggingService.getLoggingConfig(role.guild);
  if (loggingConfig?.enabled === true) {
    const loggingChannel = await loggingService.getLoggingChannel(role.guild);
    await loggingChannel?.send({
      embeds: [loggingEmbed],
    });
  }
};
