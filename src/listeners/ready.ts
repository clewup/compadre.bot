import {commands} from "../commands";
import Botty from "../base/botty";

export default (client: Botty): void => {
    client.on("ready", async () => {
        if (!client.user || !client.application) {
            return;
        }
        await client.application.commands.set(commands);

        client.logger.log(`${client.user.username} is online and serving ${client.users.cache.size} user(s).`, "log");
    });
}