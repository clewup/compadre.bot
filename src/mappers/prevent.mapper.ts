import { PreventConfig } from "@prisma/client";

export default class PreventMapper {
  map(config: PreventConfig) {
    return {
      guildId: config.guildId,
      role: config.role,
      links: config.links,
      enabled: config.enabled,
    };
  }
}
