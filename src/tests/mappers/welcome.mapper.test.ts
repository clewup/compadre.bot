import { WelcomeConfig } from "@prisma/client";
import { welcomeMapper } from "../../mappers";

describe("welcome.mapper", () => {
  it("should map correctly", () => {
    const mockConfig: WelcomeConfig = {
      guildId: "12345",
      role: "ROLE12345",
      channel: "CHANNEL12345",
      message: "WELCOME_MESSAGE",
      enabled: true,
    };

    expect(welcomeMapper.map(mockConfig)).toEqual({
      guildId: "12345",
      role: "ROLE12345",
      channel: "CHANNEL12345",
      message: "WELCOME_MESSAGE",
      enabled: true,
    });
  });
});
