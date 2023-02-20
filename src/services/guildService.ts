import Database from "../base/database";
import { Guild } from "@prisma/client";

interface IGuildService {
  getGuild: (id: string) => Promise<Guild | null>;
  createGuild: (guild: Guild) => Promise<Guild>;
}

class GuildService implements IGuildService {
  private database;

  constructor() {
    this.database = new Database();
  }

  public async getGuild(id: string): Promise<Guild | null> {
    return await this.database.guild.findFirst({ where: { id: id } });
  }

  public async createGuild(guild: Guild): Promise<Guild> {
    return this.database.guild.create({
      data: {
        id: guild.id,
        name: guild.name,
        ownerId: guild.ownerId,
        memberCount: guild.memberCount,
        joinedTimestamp: guild.joinedTimestamp,
        maximumMembers: guild.maximumMembers,
        preferredLocale: guild.preferredLocale,
      },
    });
  }
}
export default GuildService;
