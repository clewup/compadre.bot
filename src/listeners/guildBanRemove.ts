import Botty from "../base/botty";
import {GuildBan} from "discord.js";

export default (client: Botty): void => {
    client.on("guildBanRemove", async (guildBan ) => {
        handleBanRemove(guildBan);
    });
};

const handleBanRemove = (guildBan: GuildBan) => {

}