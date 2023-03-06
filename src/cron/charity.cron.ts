import CronJob from "node-cron";
import Compadre from "../structures/compadre";
import { Colors, EmbedBuilder } from "discord.js";
import { CronSchedules } from "../enums/cronSchedules";
import { Charities } from "../enums/charities";
import { notificationService } from "../services";
import { functions, logger } from "../helpers";
import { Charity } from "../types/charity";

export default class CharityCron {
  init(compadre: Compadre) {
    const charityFunction = CronJob.schedule(CronSchedules.DAILY_8AM, () => {
      logger.info("Executed the scheduled CharityFunction.");

      const charity: Charity = functions.randomArrayItem(Charities);

      compadre.guilds.cache.forEach(async (guild) => {
        const embed = new EmbedBuilder()
          .setTitle(charity.title)
          .setDescription(charity.description)
          .setColor(Colors.Purple)
          .setImage(charity.image);

        await notificationService.send(guild, embed);
      });
    });
    charityFunction.start();
  }
}
