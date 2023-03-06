import { Guild } from "@prisma/client";
import { guildMapper } from "../../mappers";

describe("guild.mapper", () => {
  it("should map correctly", () => {
    const mockGuild: Guild = {
      id: "12345",
      name: "GUILD_NAME",
      ownerId: "123456789",
      memberCount: 1,
      joinedTimestamp: BigInt(12323823782),
      maximumMembers: 1000,
      preferredLocale: "en-GB",
    };

    expect(guildMapper.map(mockGuild)).toEqual({
      id: "12345",
      name: "GUILD_NAME",
      ownerId: "123456789",
      memberCount: 1,
      joinedTimestamp: 12323823782,
      maximumMembers: 1000,
      preferredLocale: "en-GB",
    });
  });
});
