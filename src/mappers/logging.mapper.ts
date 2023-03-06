import { LoggingConfig } from "@prisma/client";

export default class LoggingMapper {
  map(config: LoggingConfig) {
    return {
      guildId: config.guildId,
      role: config.role,
      channel: config.channel,
      enabled: config.enabled,
    };
  }
}
