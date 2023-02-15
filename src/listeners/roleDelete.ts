import Botty from "../base/botty";
import {Role} from "discord.js";

export default (client: Botty): void => {
    client.on("roleDelete", async (role ) => {
        handleRoleDelete(role);
    });
};

const handleRoleDelete = (role: Role) => {

}