import { PreventConfig } from "@prisma/client";
import { preventMapper } from "../../mappers";

describe("prevent.mapper", () => {
  it("should map correctly", () => {
    const mockConfig: PreventConfig = {
      guildId: "12345",
      role: "ROLE12345",
      links: true,
      enabled: true,
    };

    expect(preventMapper.map(mockConfig)).toEqual({
      guildId: "12345",
      role: "ROLE12345",
      links: true,
      enabled: true,
    });
  });
});
