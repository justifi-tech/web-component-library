import { EventEmitter } from '@stencil/core';

/**
 * Emit a merchant-facing event under both its current `justifi-` name and the
 * older name it used to ship under, from one call.
 *
 * Every public event is declared twice — once per name — so that an
 * integration written against either one keeps working until the next major.
 * Going through this helper is what stops a call site from emitting only half
 * the pair, which is a bug nothing would catch: the merchant listening for the
 * other name simply never hears anything.
 *
 * @param event  the emitter for the `justifi-` prefixed name
 * @param legacy the emitter for the deprecated name
 * @param detail the payload, identical for both
 */
export const emitPublic = <T>(
  event: EventEmitter<T>,
  legacy: EventEmitter<T>,
  detail?: T
): void => {
  event.emit(detail);
  legacy.emit(detail);
};
