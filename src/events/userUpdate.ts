import Botty from "../base/botty";
import {PartialUser, User} from "discord.js";

export default (client: Botty): void => {
    client.on("userUpdate", async (user ) => {
        handleUserUpdate(user);
    });
};

const handleUserUpdate = (user: User | PartialUser) => {

}