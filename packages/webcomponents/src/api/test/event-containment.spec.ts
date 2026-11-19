import { readdirSync, readFileSync, statSync } from 'fs';
import { join } from 'path';

const SRC = join(__dirname, '..', '..');

/**
 * Which event names are merchant-facing contract and which are internal
 * plumbing.
 */

/**
 * Merchant-facing, as [current name, deprecated name]. Every public event is
 * declared under both and emitted through `emitPublic`; the deprecated half
 * goes away in the next major.
 */
const PUBLIC_EVENT_PAIRS: [string, string][] = [
  ['justifi-error', 'error-event'],
  ['justifi-click', 'click-event'],
  ['justifi-submit', 'submit-event'],
  ['justifi-form-step-complete', 'complete-form-step-event'],
  ['justifi-record-click', 'record-click-event'],
  ['justifi-checkout-changed', 'checkout-changed'],
  ['justifi-checkout-loaded', 'loaded'],
  ['justifi-checkout-completed', 'checkout-completed'],
  ['justifi-checkout-expired', 'checkout-expired'],
  ['justifi-insurance-updated', 'insurance-updated'],
  ['justifi-payment-method-selected', 'paymentMethodOptionSelected'],
  ['justifi-plaid-error', 'plaidError'],
  ['justifi-plaid-error-recovered', 'plaidErrorRecovered'],
  ['justifi-plaid-verification-succeeded', 'plaidVerificationSuccess'],
  ['justifi-plaid-verification-failed', 'plaidVerificationError'],
  ['justifi-apple-pay-started', 'applePayStarted'],
  ['justifi-apple-pay-completed', 'applePayCompleted'],
  ['justifi-apple-pay-cancelled', 'applePayCancelled'],
  ['justifi-apple-pay-error', 'applePayError'],
  ['justifi-google-pay-started', 'googlePayStarted'],
  ['justifi-google-pay-completed', 'googlePayCompleted'],
  ['justifi-google-pay-cancelled', 'googlePayCancelled'],
  ['justifi-paypal-started', 'paypalStarted'],
  ['justifi-paypal-completed', 'paypalCompleted'],
  ['justifi-paypal-cancelled', 'paypalCancelled'],
  ['justifi-paypal-error', 'paypalError'],
];

const PUBLIC_EVENTS = PUBLIC_EVENT_PAIRS.map(([next]) => next);
const LEGACY_EVENTS = PUBLIC_EVENT_PAIRS.map(([, legacy]) => legacy);

/**
 * Component-to-component plumbing. Contained (`bubbles: false, composed:
 * false`), never reaches the merchant's page, free to rename. Consume one by
 * listening on the emitting element — a JSX `onX` prop or `addEventListener`
 * on a ref. Never `@Listen`, which binds to the host and needs bubbling.
 */
const INTERNAL_EVENTS = ['iframe-loaded'];

const sourceFiles = (dir: string, out: string[] = []): string[] => {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      if (entry === 'test' || entry === '__snapshots__') continue;
      sourceFiles(full, out);
      // components.d.ts is generated build output, not source
    } else if (
      /\.tsx?$/.test(entry) &&
      !/\.spec\.tsx?$/.test(entry) &&
      entry !== 'components.d.ts'
    ) {
      out.push(full);
    }
  }
  return out;
};

/** Every `@Event({...})` / `@Event()` declaration with its declared options. */
const declarations = (() => {
  const found: { file: string; name: string; prop: string; options: string }[] = [];
  for (const file of sourceFiles(SRC)) {
    const src = readFileSync(file, 'utf8');
    const re = /@Event\((\{[^}]*\})?\)\s*(\w+)!?\s*:/g;
    let m: RegExpExecArray | null;
    while ((m = re.exec(src))) {
      const options = m[1] ?? '';
      const explicit = /eventName:\s*'([^']+)'/.exec(options);
      found.push({
        file: file.slice(SRC.length + 1),
        // Stencil falls back to the property name when eventName is absent
        name: explicit ? explicit[1] : m[2],
        prop: m[2],
        options,
      });
    }
  }
  return found;
})();

const internalNames = new Set<string>(INTERNAL_EVENTS);
const publicNames = new Set<string>(PUBLIC_EVENTS);
const legacyNames = new Set<string>(LEGACY_EVENTS);

describe('event containment', () => {
  it('finds the @Event declarations (guards against a broken scan)', () => {
    expect(declarations.length).toBeGreaterThan(100);
  });

  it('declares every internal event with bubbles: false and composed: false', () => {
    const leaking = declarations
      .filter((d) => internalNames.has(d.name))
      .filter(
        (d) =>
          !/bubbles:\s*false/.test(d.options) ||
          !/composed:\s*false/.test(d.options),
      )
      .map((d) => `${d.file} -> ${d.name}`);

    expect(leaking).toEqual([]);
  });

  it('covers every name in the internal registry', () => {
    const declared = new Set(declarations.map((d) => d.name));
    const unused = [...internalNames].filter((n) => !declared.has(n));

    expect(unused).toEqual([]);
  });

  // validateRequiredProps took a single emitter and emitted through it
  // directly, so the deprecated name never fired and every integration still
  // on it went silent. Public events go through emitPublic, always.
  it('never emits a public event directly, only through emitPublic', () => {
    const emitterProps = new Set<string>();
    for (const d of declarations) {
      if (publicNames.has(d.name) || legacyNames.has(d.name)) emitterProps.add(d.prop);
    }

    const direct: string[] = [];
    for (const f of sourceFiles(SRC)) {
      const rel = f.slice(SRC.length + 1);
      if (rel === join('api', 'emit-public.ts')) continue; // the helper itself
      const src = readFileSync(f, 'utf8');
      for (const prop of emitterProps) {
        // matches both `this.errorEvent.emit(` and a bare `errorEvent.emit(`
        // parameter inside a shared helper
        if (new RegExp('(?<![\\w.])(?:this\\.)?' + prop + '\\.emit\\(').test(src)) {
          direct.push(rel + ' -> ' + prop + '.emit()');
        }
      }
    }
    expect(direct).toEqual([]);
  });

  it('pairs every public name with exactly one deprecated name', () => {
    expect(new Set(PUBLIC_EVENTS).size).toBe(PUBLIC_EVENT_PAIRS.length);
    expect(new Set(LEGACY_EVENTS).size).toBe(PUBLIC_EVENT_PAIRS.length);
  });

  it('prefixes every public event name with justifi-', () => {
    const unprefixed = PUBLIC_EVENTS.filter((n) => !n.startsWith('justifi-'));
    expect(unprefixed).toEqual([]);
  });

  // Each public event is declared twice, once per name. A component that
  // declares only one of the pair leaves half its listeners deaf, and nothing
  // at runtime says so.
  it('declares every public event under both its names', () => {
    const byFile = new Map<string, Set<string>>();
    for (const d of declarations) {
      if (!byFile.has(d.file)) byFile.set(d.file, new Set());
      byFile.get(d.file)!.add(d.name);
    }
    const halfPairs: string[] = [];
    for (const [file, names] of byFile) {
      for (const [newName, legacyName] of PUBLIC_EVENT_PAIRS) {
        if (names.has(newName) !== names.has(legacyName)) {
          const present = names.has(newName) ? newName : legacyName;
          halfPairs.push(file + ' -> ' + present + ' has no twin');
        }
      }
    }
    expect(halfPairs).toEqual([]);
  });

  // Listening for both names runs the handler twice per event.
  it('never listens internally for a deprecated public name', () => {
    const offenders: string[] = [];
    for (const f of sourceFiles(SRC)) {
      const src = readFileSync(f, 'utf8');
      // justifi-qr-terminal suppresses both names on purpose
      if (/suppressInnerLegacyErrors/.test(src)) continue;
      for (const name of legacyNames) {
        if (new RegExp("@Listen\\(['\"]" + name + "['\"]\\)").test(src)) {
          offenders.push(f.slice(SRC.length + 1) + " -> @Listen('" + name + "')");
        }
      }
    }
    expect(offenders).toEqual([]);
  });

  it('keeps every public event reachable from the host page', () => {
    const contained = declarations
      .filter((d) => publicNames.has(d.name) || legacyNames.has(d.name))
      .filter(
        (d) =>
          /bubbles:\s*false/.test(d.options) ||
          /composed:\s*false/.test(d.options),
      )
      .map((d) => `${d.file} -> ${d.name}`);

    expect(contained).toEqual([]);
  });

  // Stencil statically evaluates the decorator, so an imported constant is
  // silently ignored and the event falls back to its property name. The
  // literals therefore have to be spelled out, and this is what keeps them
  // honest against the registry.
  it('uses only registered names for contained events', () => {
    const strays = declarations
      .filter((d) => /bubbles:\s*false/.test(d.options))
      .filter((d) => !internalNames.has(d.name))
      .map((d) => `${d.file} -> ${d.name}`);

    expect(strays).toEqual([]);
  });

  // A renamed event is only half the job: every addEventListener / dispatchEvent
  // that still spells the old name out is now waiting for something nobody
  // emits, and nothing fails loudly. This is what caught the card-form and
  // bank-account-form listeners still waiting on 'iframeLoaded'.
  it('leaves no reference to a pre-rename internal event name', () => {
    const RENAMED = [
      'formControlInput',
      'formControlBlur',
      'formLoading',
      'formCompleted',
      'ownerSubmitted',
      'showEvent',
      'hideEvent',
      'checkboxChanged',
      'fileSelected',
      'iframeLoaded',
      'selectedQuantityChange',
    ];
    const offenders: string[] = [];
    for (const f of sourceFiles(SRC)) {
      const src = readFileSync(f, 'utf8');
      for (const name of RENAMED) {
        // a quoted name is an event name; a bare identifier is the emitter property
        if (new RegExp('[\'"`]' + name + '[\'"`]').test(src)) {
          offenders.push(f.slice(SRC.length + 1) + " -> '" + name + "'");
        }
      }
    }
    expect(offenders).toEqual([]);
  });
});
