import { readdirSync, readFileSync, statSync } from 'fs';
import { join } from 'path';

const SRC = join(__dirname, '..', '..');

/**
 * Every payment method a shopper can pick has to report it. Miss one and the
 * merchant's selection tracking just goes quiet for that option — nothing
 * fails, nothing logs.
 */
const OPTIONS: { tag: string; file: string }[] = [
  { tag: 'justifi-tokenize-payment-method', file: 'components/tokenize-payment-method/justifi-tokenize-payment-method.tsx' },
  { tag: 'justifi-saved-payment-methods', file: 'components/modular-checkout/sub-components/justifi-saved-payment-methods.tsx' },
  { tag: 'justifi-saved-payment-method', file: 'components/checkout/justifi-saved-payment-method.tsx' },
  { tag: 'justifi-sezzle-payment-method', file: 'components/modular-checkout/sub-components/justifi-sezzle-payment-method.tsx' },
  { tag: 'justifi-plaid-payment-method', file: 'components/modular-checkout/sub-components/justifi-plaid-payment-method.tsx' },
  { tag: 'justifi-apple-pay', file: 'components/modular-checkout/sub-components/justifi-apple-pay.tsx' },
  { tag: 'justifi-google-pay', file: 'components/modular-checkout/sub-components/justifi-google-pay.tsx' },
  { tag: 'justifi-paypal', file: 'components/modular-checkout/sub-components/paypal/justifi-paypal.tsx' },
];

const EVENT = 'justifi-payment-method-selected';
const LEGACY = 'paymentMethodOptionSelected';

const read = (rel: string) => readFileSync(join(SRC, rel), 'utf8');

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

describe('justifi-payment-method-selected', () => {
  it.each(OPTIONS.map((o) => [o.tag, o] as const))('%s declares both names', (_tag, option) => {
    const src = read(option.file);
    expect(src).toContain(`eventName: '${EVENT}'`);
    expect(src).toContain(`eventName: '${LEGACY}'`);
  });

  it.each(OPTIONS.map((o) => [o.tag, o] as const))('%s emits it', (_tag, option) => {
    const src = read(option.file);
    expect(src).toMatch(/emitPublic\(\s*this\.paymentMethodSelected,\s*this\.paymentMethodSelectedLegacy/);
  });

  it('emits the same { id?, type } shape everywhere', () => {
    const offenders: string[] = [];
    for (const option of OPTIONS) {
      const src = read(option.file);
      const calls = src.match(/emitPublic\(\s*this\.paymentMethodSelected,[\s\S]*?\);/g) ?? [];
      for (const call of calls) {
        const payload = call.slice(call.indexOf('Legacy,') + 'Legacy,'.length, call.lastIndexOf(')'));
        if (!/type\s*:/.test(payload)) offenders.push(`${option.tag} -> no type in ${payload.trim()}`);
      }
    }
    expect(offenders).toEqual([]);
  });

  // a new option component should not be able to join quietly
  it('lists every component that emits it', () => {
    const declared = sourceFiles(SRC)
      .filter((f) => new RegExp(`eventName: '${EVENT}'`).test(readFileSync(f, 'utf8')))
      .map((f) => f.slice(SRC.length + 1));

    expect(declared.sort()).toEqual(OPTIONS.map((o) => o.file).sort());
  });
});
