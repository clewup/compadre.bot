import { ClientEvents } from "discord.js";
import Botty from "./botty";

interface OverriddenClientEvents extends Omit<ClientEvents, "ready"> {
  ready: [client: Botty<true>];
}

interface EventOptions<Key extends keyof ClientEvents> {
  name: Key;
  once?: boolean;
  execute: (...args: OverriddenClientEvents[Key]) => any;
}

export class Event<Key extends keyof ClientEvents>
  implements EventOptions<Key>
{
  name: EventOptions<Key>["name"];
  once?: EventOptions<Key>["once"];
  execute: EventOptions<Key>["execute"];

  constructor(options: EventOptions<Key>) {
    this.name = options.name;
    this.once = options.once;
    this.execute = options.execute;
  }
}
