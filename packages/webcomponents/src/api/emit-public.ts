import { EventEmitter } from '@stencil/core';

/**
 * Emit a merchant-facing event under both its current `justifi-` name and the
 * older name it used to ship under, from one call.
 *
 * @param event  the emitter for the `justifi-` prefixed name
 * @param legacy the emitter for the deprecated name
 * @param detail the payload, identical for both
 */
export const emitPublic = <T>(
  event: EventEmitter<T>,
  legacy: EventEmitter<T>,
  detail?: T,
): void => {
  event.emit(detail);
  legacy.emit(detail);
};
