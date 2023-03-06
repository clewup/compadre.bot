import { ClientEvents } from "discord.js";
import Compadre from "./compadre";

interface OverriddenClientEvents extends Omit<ClientEvents, "ready"> {
  ready: [client: Compadre<true>];
}

interface EventOptions<Key extends keyof ClientEvents> {
  name: Key;
  once?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  execute: (...args: OverriddenClientEvents[Key]) => any;
}

/**
 *    @class
 *    Creates a new instance of Event.
 */
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
