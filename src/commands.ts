import Hello from "./commands/hello";
import Ping from "./commands/ping";
import Clear from "./commands/clear";
import {CommandClass} from "./base/command";

export const commands: CommandClass[] = [Hello, Ping, Clear]