import GuildService from "./guild.service";
import LoggingService from "./logging.service";
import MemberService from "./member.service";
import NotificationService from "./notification.service";
import OpenAiService from "./openai.service";
import PreventService from "./prevent.service";
import RoleService from "./role.service";
import WelcomeService from "./welcome.service";

const guildService = new GuildService();
const loggingService = new LoggingService();
const memberService = new MemberService();
const notificationService = new NotificationService();
const openAiService = new OpenAiService();
const preventService = new PreventService();
const roleService = new RoleService();
const welcomeService = new WelcomeService();

export {
  guildService,
  loggingService,
  memberService,
  notificationService,
  openAiService,
  preventService,
  roleService,
  welcomeService,
};
