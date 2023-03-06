import { Event } from "../structures/event";
import { AuditLogEvent, Events, Role } from "discord.js";
import { loggingService, roleService } from "../services";
import { functions, logger } from "../helpers";

/**
 *    @name roleUpdate
 *    @description Emitted whenever a role is updated.
 */
export default new Event({
  name: Events.GuildRoleUpdate,
  async execute(role) {
    logger.info(
      `Role "${role.name}" has been updated in ${functions.getGuildString(
        role.guild
      )}.`
    );

    await roleService.update(role);

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
  let reason = null;
  if (roleLog && roleLog.target?.id === role.id && roleLog.executor) {
    updatedBy = roleLog.executor;
    reason = roleLog.reason;
  }

  const embed = await loggingService.createEmbed("**Role Updated**", [
    {
      name: "Role",
      value: `${role.name}`,
      inline: false,
    },
    {
      name: "Updated By",
      value: `${
        updatedBy ? functions.getUserMentionString(updatedBy) : "Unknown"
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
