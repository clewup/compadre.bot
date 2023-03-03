import { Event } from "../structures/event";
import { AuditLogEvent, EmbedBuilder, Events, Role } from "discord.js";
import RoleService from "../services/roleService";
import LoggingService from "../services/loggingService";

/**
 *    @name roleUpdate
 *    @description Emitted whenever a role is updated.
 */
export default new Event({
  name: Events.GuildRoleUpdate,
  async execute(role) {
    const roleService = new RoleService();

    // [Logging]
    role.client.logger.logInfo(
      `Role "${
        role.name
      }" has been updated in ${role.client.functions.getGuildString(
        role.guild
      )}.`
    );

    // [GuildLogging]
    await handleGuildLogging(role);

    // [Database]
    await roleService.updateRole(role);
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

  // Create the embed
  const loggingEmbed = new EmbedBuilder()
    .setTitle("**Updated Role**")
    .addFields([
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
