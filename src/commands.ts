import Hello from "./commands/hello";
import Ping from "./commands/ping";
import Clear from "./commands/clear";
import {Command} from "./base/command";

export const commands: Command[] = [Hello, Ping, Clear]