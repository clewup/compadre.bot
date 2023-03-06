import { NotificationConfig } from "@prisma/client";
import { notificationMapper } from "../../mappers";

describe("notification.mapper", () => {
  it("should map correctly", () => {
    const mockConfig: NotificationConfig = {
      guildId: "12345",
      channel: "CHANNEL12345",
      enabled: true,
    };

    expect(notificationMapper.map(mockConfig)).toEqual({
      guildId: "12345",
      channel: "CHANNEL12345",
      enabled: true,
    });
  });
});
