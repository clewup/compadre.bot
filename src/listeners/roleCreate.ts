import Botty from "../base/botty";
import {Role} from "discord.js";

export default (client: Botty): void => {
    client.on("roleCreate", async (role ) => {
        handleRoleCreate(role);
    });
};

const handleRoleCreate = (role: Role) => {

}