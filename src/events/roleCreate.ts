import { Event } from "../structures/event";
import { AuditLogEvent, EmbedBuilder, Events, Role } from "discord.js";
import { loggingService, roleService } from "../services";
import { functions, logger } from "../helpers";

/**
 *    @name roleCreate
 *    @description Emitted whenever a role is created.
 */
export default new Event({
  name: Events.GuildRoleCreate,
  async execute(role) {
    logger.info(
      `Role "${role.name}" has been created in ${functions.getGuildString(
        role.guild
      )}.`
    );

    await roleService.create(role);

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

  const embed = await loggingService.createEmbed("**Role Created**", [
    {
      name: "Role",
      value: `${role.name}`,
      inline: false,
    },
    {
      name: "Created By",
      value: `${
        createdBy ? functions.getUserMentionString(createdBy) : "Unknown"
      }`,
      inline: false,
    },
    {
      name: "Permissions",
      value: `${role.permissions.toJSON()}`,
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
