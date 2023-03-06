import { Role } from "@prisma/client";
import { roleMapper } from "../../mappers";

describe("role.mapper", () => {
  it("should map correctly", () => {
    const mockRole: Role = {
      id: "12345",
      name: "ROLE_NAME",
      guildId: "GUILD12345",
    };

    expect(roleMapper.map(mockRole)).toEqual({
      id: "12345",
      name: "ROLE_NAME",
      guildId: "GUILD12345",
    });
  });
});
