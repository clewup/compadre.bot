import { Event } from "../structures/event";
import {
  AuditLogEvent,
  EmbedBuilder,
  Events,
  GuildMember,
  Role,
} from "discord.js";
import RoleService from "../services/roleService";
import LoggingService from "../services/loggingService";

/**
 *    @name roleCreate
 *    @description Emitted whenever a role is created.
 */
export default new Event({
  name: Events.GuildRoleCreate,
  async execute(role) {
    const roleService = new RoleService();

    // [Logging]
    role.client.logger.logInfo(
      `Role "${
        role.name
      }" has been created in ${role.client.functions.getGuildString(
        role.guild
      )}.`
    );

    // [GuildLogging]
    await handleGuildLogging(role);

    // [Database]
    await roleService.createRole(role);
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
  if (roleLog && roleLog.target?.id === role.id && roleLog.executor) {
    createdBy = roleLog.executor;
  }

  // Create the embed
  const loggingEmbed = new EmbedBuilder()
    .setTitle("**New Role**")
    .addFields([
      {
        name: "Role",
        value: `${role.name}`,
      },
      {
        name: "Created By",
        value: `${
          createdBy ? role.client.functions.getUserString(createdBy) : "Unknown"
        }`,
      },
      {
        name: "Permissions",
        value: `${role.permissions.toJSON()}`,
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
