import Botty from "../base/botty";
import { Role} from "discord.js";

export default (client: Botty): void => {
    client.on("roleUpdate", async (role ) => {
        handleRoleUpdate(role);
    });
};

const handleRoleUpdate = (role: Role) => {

}