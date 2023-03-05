import GuildService from "./guild.service";
import LoggingService from "./logging.service";
import MemberService from "./member.service";
import NotificationService from "./notification.service";
import OpenAiService from "./openai.service";
import PreventService from "./prevent.service";
import RoleService from "./role.service";
import WelcomeService from "./welcome.service";
import {
  guildRepository,
  loggingRepository,
  memberRepository,
  notificationRepository,
  preventRepository,
  roleRepository,
  welcomeRepository,
} from "../data";

const guildService = new GuildService(
  guildRepository,
  memberRepository,
  roleRepository
);
const loggingService = new LoggingService(loggingRepository);
const memberService = new MemberService(memberRepository);
const notificationService = new NotificationService(notificationRepository);
const openAiService = new OpenAiService();
const preventService = new PreventService(preventRepository);
const roleService = new RoleService(roleRepository);
const welcomeService = new WelcomeService(welcomeRepository);

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
