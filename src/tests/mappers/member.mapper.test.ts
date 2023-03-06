import { Member } from "@prisma/client";
import { memberMapper } from "../../mappers";

describe("member.mapper", () => {
  it("should map correctly", () => {
    const mockMember: Member = {
      id: "12345",
      bot: false,
      username: "MEMBER_USERNAME",
      discriminator: "ABCD",
      guildAdmin: true,
      clientAdmin: false,
      guildId: "GUILD12345",
    };

    expect(memberMapper.map(mockMember)).toEqual({
      id: "12345",
      bot: false,
      username: "MEMBER_USERNAME",
      discriminator: "ABCD",
      guildAdmin: true,
      clientAdmin: false,
      guildId: "GUILD12345",
    });
  });
});
