import { ShardingManager as DiscordShardingManager } from "discord.js";
import config from "../config";
import Logger from "../helpers/logger";

class ShardingManager extends DiscordShardingManager {
  readonly logger;

  constructor() {
    super("dist/app.js", {
      token: config.discordClientToken,
    });

    this.logger = new Logger();
  }

  public init() {
    this.on("shardCreate", (shard) => {
      this.logger.logInfo(`Sharding Manager has launched shard ${shard.id}.`);
    });
  }
}
export default ShardingManager;
