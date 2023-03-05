import GuildRepository from "./guild.repository";
import LoggingRepository from "./logging.repository";
import MemberRepository from "./member.repository";
import NotificationRepository from "./notification.repository";
import PreventRepository from "./prevent.repository";
import RoleRepository from "./role.repository";
import WelcomeRepository from "./welcome.repository";
import Database from "../structures/database";

const database = new Database();

const guildRepository = new GuildRepository(database);
const loggingRepository = new LoggingRepository(database);
const memberRepository = new MemberRepository(database);
const notificationRepository = new NotificationRepository(database);
const preventRepository = new PreventRepository(database);
const roleRepository = new RoleRepository(database);
const welcomeRepository = new WelcomeRepository(database);

export {
  guildRepository,
  loggingRepository,
  memberRepository,
  notificationRepository,
  preventRepository,
  roleRepository,
  welcomeRepository,
};
