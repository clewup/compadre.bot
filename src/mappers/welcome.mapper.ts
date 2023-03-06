import { WelcomeConfig } from "@prisma/client";

export default class WelcomeMapper {
  map(config: WelcomeConfig) {
    return {
      guildId: config.guildId,
      role: config.role,
      channel: config.channel,
      message: config.message,
      enabled: config.enabled,
    };
  }
}
