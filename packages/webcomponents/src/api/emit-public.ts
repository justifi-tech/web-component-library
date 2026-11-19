import { EventEmitter } from '@stencil/core';

/**
 * Emit a merchant-facing event under its current `justifi-` name, and under the
 * older name when the component already shipped one.
 *
 * Pass `null` for `legacy` when the event is new to that component: adding a
 * deprecated name there would invent a contract nobody ever listened for.
 *
 * @param event  the emitter for the `justifi-` prefixed name
 * @param legacy the emitter for the deprecated name, or `null` when there isn't one
 * @param detail the payload
 */
export function emitPublic<T>(
  event: EventEmitter<T>,
  legacy: EventEmitter<T> | null,
  detail?: T,
): void;
/**
 * Same, for a deprecated name that predates the current payload shape and has
 * to keep emitting exactly what it always did.
 *
 * @param legacyDetail the payload for the deprecated name
 */
export function emitPublic<T, L>(
  event: EventEmitter<T>,
  legacy: EventEmitter<L>,
  detail: T,
  legacyDetail: L,
): void;
export function emitPublic(
  event: EventEmitter<any>,
  legacy: EventEmitter<any> | null,
  detail?: any,
  legacyDetail?: any,
): void {
  event.emit(detail);
  legacy?.emit(legacyDetail === undefined ? detail : legacyDetail);
}
