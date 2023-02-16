import {EventClass} from "./base/event";
import guildBanAdd from "./events/guildBanAdd";
import guildBanRemove from "./events/guildBanRemove";
import guildMemberUpdate from "./events/guildMemberUpdate";
import interactionCreate from "./events/interactionCreate";
import messageCreate from "./events/messageCreate";
import messageDelete from "./events/messageDelete";
import ready from "./events/ready";
import roleCreate from "./events/roleCreate";
import roleDelete from "./events/roleDelete";
import roleUpdate from "./events/roleUpdate";
import userUpdate from "./events/userUpdate";

export const events: EventClass<any>[] = [guildBanAdd, guildBanRemove, guildMemberUpdate, interactionCreate, messageCreate, messageDelete, ready, roleCreate, roleDelete, roleUpdate, userUpdate]