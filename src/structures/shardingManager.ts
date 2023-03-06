import { ShardingManager as DiscordShardingManager } from "discord.js";
import config from "../config";
import { logger } from "../helpers";

class ShardingManager extends DiscordShardingManager {
  constructor() {
    super("dist/app.js", {
      token: config.discordClientToken,
    });
  }

  init() {
    this.on("shardCreate", (shard) => {
      logger.info(`Sharding Manager has launched shard ${shard.id}.`);
    });
  }
}
export default ShardingManager;
