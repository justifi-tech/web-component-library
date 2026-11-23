import { readdirSync, readFileSync, statSync } from 'fs';
import { join } from 'path';

const SRC = join(__dirname, '..', '..');

/**
 * Every payment method a shopper can pick has to report it. Miss one and the
 * merchant's selection tracking just goes quiet for that option — nothing
 * fails, nothing logs.
 *
 * `legacy` is what the component already did with the deprecated name, and it
 * stays that way. The deprecated name is never added where it did not already
 * ship: a merchant cannot have been listening for an event that never fired.
 *
 *   emits — fired it, with its own payload, which does not change here
 *   none  — never fired it, and does not start now
 */
const OPTIONS: { tag: string; file: string; legacy: 'emits' | 'none' }[] = [
  {
    tag: 'justifi-tokenize-payment-method',
    file: 'components/tokenize-payment-method/justifi-tokenize-payment-method.tsx',
    legacy: 'none',
  },
  {
    tag: 'justifi-saved-payment-methods',
    file: 'components/modular-checkout/sub-components/justifi-saved-payment-methods.tsx',
    legacy: 'none',
  },
  {
    tag: 'justifi-saved-payment-method',
    file: 'components/checkout/justifi-saved-payment-method.tsx',
    legacy: 'emits',
  },
  {
    tag: 'justifi-sezzle-payment-method',
    file: 'components/modular-checkout/sub-components/justifi-sezzle-payment-method.tsx',
    legacy: 'emits',
  },
  {
    tag: 'justifi-plaid-payment-method',
    file: 'components/modular-checkout/sub-components/justifi-plaid-payment-method.tsx',
    // declared the deprecated emitter for years and never fired it; dropped
    legacy: 'none',
  },
  {
    tag: 'justifi-apple-pay',
    file: 'components/modular-checkout/sub-components/justifi-apple-pay.tsx',
    legacy: 'none',
  },
  {
    tag: 'justifi-google-pay',
    file: 'components/modular-checkout/sub-components/justifi-google-pay.tsx',
    legacy: 'none',
  },
  {
    tag: 'justifi-paypal',
    file: 'components/modular-checkout/sub-components/paypal/justifi-paypal.tsx',
    legacy: 'none',
  },
];

const EVENT = 'justifi-payment-method-selected';
const LEGACY = 'paymentMethodOptionSelected';

const read = (rel: string) => readFileSync(join(SRC, rel), 'utf8');

/** The `emitPublic(this.paymentMethodSelected, …)` calls in one file. */
const calls = (src: string) =>
  src.match(/emitPublic\(\s*this\.paymentMethodSelected,[\s\S]*?\);/g) ?? [];

const sourceFiles = (dir: string, out: string[] = []): string[] => {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      if (entry === 'test' || entry === '__snapshots__') continue;
      sourceFiles(full, out);
    } else if (/\.tsx?$/.test(entry) && !/\.spec\.tsx?$/.test(entry) && entry !== 'components.d.ts') {
      out.push(full);
    }
  }
  return out;
};

const each = OPTIONS.map((o) => [o.tag, o] as const);

describe(EVENT, () => {
  it.each(each)('%s declares it', (_tag, option) => {
    expect(read(option.file)).toContain(`eventName: '${EVENT}'`);
  });

  it.each(each)('%s emits it', (_tag, option) => {
    expect(calls(read(option.file)).length).toBeGreaterThan(0);
  });

  it.each(each)('%s emits a payload carrying a type', (_tag, option) => {
    const payloads = calls(read(option.file)).map((call) =>
      call.slice(call.indexOf('{'), call.lastIndexOf('}') + 1),
    );
    expect(payloads.every((p) => /type\s*:/.test(p))).toBe(true);
  });

  // Adding the deprecated name to a component that never had it invents a
  // contract: nothing was listening for it, and it would have to be deprecated
  // on arrival.
  it.each(each)('%s keeps the deprecated name exactly where it was', (_tag, option) => {
    const src = read(option.file);

    if (option.legacy === 'none') {
      expect(src).not.toContain(`eventName: '${LEGACY}'`);
      expect(src).not.toContain('paymentMethodSelectedLegacy');
      return;
    }

    expect(src).toContain(`eventName: '${LEGACY}'`);
  });

  it.each(each)('%s passes the deprecated emitter only when it fires one', (_tag, option) => {
    for (const call of calls(read(option.file))) {
      if (option.legacy === 'emits') {
        expect(call).toMatch(/this\.paymentMethodSelected,\s*this\.paymentMethodSelectedLegacy,/);
      } else {
        expect(call).toMatch(/this\.paymentMethodSelected,\s*null,/);
      }
    }
  });

  // The two components that already fired it keep their original payloads —
  // a merchant's handler cannot change shape under them.
  it('keeps the payload the deprecated name always shipped', () => {
    expect(read(OPTIONS.find((o) => o.tag === 'justifi-saved-payment-method')!.file)).toContain(
      'this.paymentMethodOption,',
    );
    expect(read(OPTIONS.find((o) => o.tag === 'justifi-sezzle-payment-method')!.file)).toMatch(
      /\{ type: PAYMENT_METHODS\.SEZZLE \},\s*(\/\/[^\n]*\n\s*)?PAYMENT_METHODS\.SEZZLE,/,
    );
  });

  // a new option component should not be able to join quietly
  it('lists every component that emits it', () => {
    const declared = sourceFiles(SRC)
      .filter((f) => new RegExp(`eventName: '${EVENT}'`).test(readFileSync(f, 'utf8')))
      .map((f) => f.slice(SRC.length + 1));

    expect(declared.sort()).toEqual(OPTIONS.map((o) => o.file).sort());
  });
});
