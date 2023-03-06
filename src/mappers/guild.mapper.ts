import { Guild } from "@prisma/client";

export default class GuildMapper {
  map(guild: Guild) {
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
}
