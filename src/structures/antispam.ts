import BaseAntiSpam from "discord-anti-spam";
import { PermissionsBitField } from "discord.js";

class AntiSpam extends BaseAntiSpam {
  constructor() {
    super({
      warnThreshold: 3, // Amount of messages sent in a row that will cause a warning.
      muteThreshold: 6, // Amount of messages sent in a row that will cause a mute.
      kickThreshold: 9, // Amount of messages sent in a row that will cause a kick.
      banThreshold: 12, // Amount of messages sent in a row that will cause a ban.
      warnMessage: "Stop spamming!", // Message sent in the channel when a user is warned.
      muteMessage: "You have been muted for spamming!", // Message sent in the channel when a user is muted.
      kickMessage: "You have been kicked for spamming!", // Message sent in the channel when a user is kicked.
      banMessage: "You have been banned for spamming!", // Message sent in the channel when a user is banned.
      unMuteTime: 60, // Time in minutes before the user will be able to send messages again.
      verbose: false, // Whether or not to log every action in the console.
      removeMessages: true, // Whether or not to remove all messages sent by the user.
      ignoredPermissions: [PermissionsBitField.Flags.Administrator], // If the user has the following permissions, ignore him.
    });
  }
}
export default AntiSpam;
