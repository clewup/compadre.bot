import { LoggingConfig } from "@prisma/client";
import { loggingMapper } from "../../mappers";

describe("logging.mapper", () => {
  it("should map correctly", () => {
    const mockConfig: LoggingConfig = {
      guildId: "12345",
      role: "ROLE12345",
      channel: "CHANNEL12345",
      enabled: true,
    };

    expect(loggingMapper.map(mockConfig)).toEqual({
      guildId: "12345",
      role: "ROLE12345",
      channel: "CHANNEL12345",
      enabled: true,
    });
  });
});
