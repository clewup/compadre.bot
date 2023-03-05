import {
  Guild,
  LoggingConfig,
  Member,
  NotificationConfig,
  PreventConfig,
  Role,
  WelcomeConfig,
} from "@prisma/client";

export default class Mappers {
  mapGuild(guild: Guild) {
    return {
      id: guild.id,
      name: guild.name,
      ownerId: guild.ownerId,
      memberCount: guild.memberCount,
      joinedTimestamp: Number(guild.joinedTimestamp),
      maximumMembers: guild.maximumMembers,
      preferredLocale: guild.preferredLocale,
    };
  }

  mapLogging(config: LoggingConfig) {
    return {
      guildId: config.guildId,
      role: config.role,
      channel: config.channel,
      enabled: config.enabled,
    };
  }

  mapMember(member: Member) {
    return {
      id: member.id,
      bot: member.bot,
      username: member.username,
      discriminator: member.discriminator,
      guildAdmin: member.guildAdmin,
      clientAdmin: member.clientAdmin,
      guildId: member.guildId,
    };
  }

  mapNotification(config: NotificationConfig) {
    return {
      guildId: config.guildId,
      channel: config.channel,
      enabled: config.enabled,
    };
  }

  mapPrevent(config: PreventConfig) {
    return {
      guildId: config.guildId,
      role: config.role,
      links: config.links,
      enabled: config.enabled,
    };
  }

  mapRole(role: Role) {
    return {
      id: role.id,
      name: role.name,
      guildId: role.guildId,
    };
  }

  mapWelcome(config: WelcomeConfig) {
    return {
      guildId: config.guildId,
      role: config.role,
      channel: config.channel,
      message: config.message,
      enabled: config.enabled,
    };
  }
}
