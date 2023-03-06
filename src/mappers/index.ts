import GuildMapper from "./guild.mapper";
import LoggingMapper from "./logging.mapper";
import MemberMapper from "./member.mapper";
import NotificationMapper from "./notification.mapper";
import PreventMapper from "./prevent.mapper";
import RoleMapper from "./role.mapper";
import WelcomeMapper from "./welcome.mapper";

const guildMapper = new GuildMapper();
const loggingMapper = new LoggingMapper();
const memberMapper = new MemberMapper();
const notificationMapper = new NotificationMapper();
const preventMapper = new PreventMapper();
const roleMapper = new RoleMapper();
const welcomeMapper = new WelcomeMapper();

export {
  guildMapper,
  loggingMapper,
  memberMapper,
  notificationMapper,
  preventMapper,
  roleMapper,
  welcomeMapper,
};
