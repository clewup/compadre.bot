import GuildController from "./guild.controller";
import LoggingController from "./logging.controller";
import MemberController from "./member.controller";
import NotificationController from "./notification.controller";
import PreventController from "./prevent.controller";
import RoleController from "./role.controller";
import WelcomeController from "./welcome.controller";

const guildController = new GuildController();
const loggingController = new LoggingController();
const memberController = new MemberController();
const notificationController = new NotificationController();
const preventController = new PreventController();
const roleController = new RoleController();
const welcomeController = new WelcomeController();

export {
  guildController,
  loggingController,
  memberController,
  notificationController,
  preventController,
  roleController,
  welcomeController,
};
