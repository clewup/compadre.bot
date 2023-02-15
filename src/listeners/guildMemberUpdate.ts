import Botty from "../base/botty";
import {GuildMember, PartialGuildMember} from "discord.js";

export default (client: Botty): void => {
    client.on("guildMemberUpdate", async (oldMember, newMember ) => {
        handleMemberUpdate(oldMember, newMember);
    });
};

const handleMemberUpdate = (oldMember: GuildMember | PartialGuildMember,  newMember: GuildMember) => {

}