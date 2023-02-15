import {ICommand} from "./types/command";
import {Hello} from "./commands/hello";
import {Ping} from "./commands/ping";

export const commands: ICommand[] = [Hello, Ping]