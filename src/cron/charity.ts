import CronJob from "node-cron";
import Compadre from "../structures/compadre";
import { Colors, EmbedBuilder } from "discord.js";
import { CronSchedules } from "../data/enums/cronSchedules";
import { Charities } from "../data/enums/charities";

class CharityFunction {
  public init(compadre: Compadre) {
    const charityFunction = CronJob.schedule(CronSchedules.DAILY_8AM, () => {
      compadre.logger.logInfo("Executed the scheduled CharityFunction.");

      const notificationService = compadre.services.notificationService;
      const charity = compadre.functions.randomArrayItem(Charities);

      compadre.guilds.cache.forEach(async (guild) => {
        const embed = new EmbedBuilder()
          .setTitle(charity.title)
          .setDescription(charity.description)
          .setColor(Colors.Purple)
          .setImage(charity.image);

        await notificationService.sendNotificationMessage(guild, embed);
      });
    });
    charityFunction.start();
  }
}
export default CharityFunction;
