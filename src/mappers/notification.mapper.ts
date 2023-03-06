import { NotificationConfig } from "@prisma/client";

export default class NotificationMapper {
  map(config: NotificationConfig) {
    return {
      guildId: config.guildId,
      channel: config.channel,
      enabled: config.enabled,
    };
  }
}
