import Botty from "../base/botty";
import {GuildBan} from "discord.js";

export default (client: Botty): void => {
    client.on("guildBanAdd", async (guildBan ) => {
        handleBanAdd(guildBan);
    });
};

const handleBanAdd = (guildBan: GuildBan) => {

}