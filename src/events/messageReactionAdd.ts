import { Event } from "../structures/event";
import { Events } from "discord.js";
import WelcomeService from "../services/welcomeService";

/**
 *    @name messageReactionAdd
 *    @description Emitted whenever a reaction is added to a message.
 */
export default new Event({
  name: Events.MessageReactionAdd,
  async execute(reaction, user) {
    if (!reaction.message.guild) return;

    const welcomeService = new WelcomeService();

    // [Logging]
    reaction.client.logger.logInfo(
      `${reaction.client.functions.getUserString(
        user
      )} has reacted to the message "${
        reaction.message.content
      }" in ${reaction.client.functions.getGuildString(
        reaction.message.guild
      )}.`
    );

    // [Welcome]: Update the user's role.
    const welcomeConfig = await welcomeService.getWelcomeConfig(
      reaction.message.guild
    );
    if (
      welcomeConfig &&
      welcomeConfig.role &&
      welcomeConfig.channel === reaction.message.channel.id &&
      welcomeConfig.enabled === true
    ) {
      const role = await reaction.message.guild.roles.fetch(welcomeConfig.role);
      const guildUser = await reaction.message.guild.members.fetch(user.id);

      if (role && guildUser) {
        await guildUser.roles.add(role);
      }
    }
  },
});
