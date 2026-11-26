import { EventEmitter } from "node:events";
import { logger } from "@/infra/logger";

const bus = new EventEmitter();

/** Announce a fact to whoever listens; the publisher never knows who that is. */
export function publish<T>(name: string, payload: T): void {
  bus.emit(name, payload);
}

/**
 * Run `handler` for every `name` event, after the publisher has moved on. A
 * failing handler is logged and never reaches the publisher. Returns a function
 * that stops listening.
 */
export function subscribe<T>(name: string, handler: (payload: T) => Promise<void> | void): () => void {
  const listener = (payload: T) => {
    Promise.resolve()
      .then(() => handler(payload))
      .catch((error: unknown) => logger.error({ err: error, event: name }, "Event handler failed"));
  };

  bus.on(name, listener);

  return () => {
    bus.off(name, listener);
  };
}
