import { readdirSync, readFileSync, statSync } from 'fs';
import { join } from 'path';
import { INTERNAL_EVENTS, PUBLIC_EVENTS } from '../event-names';

const SRC = join(__dirname, '..', '..');

const sourceFiles = (dir: string, out: string[] = []): string[] => {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      if (entry === 'test' || entry === '__snapshots__') continue;
      sourceFiles(full, out);
      // components.d.ts is generated build output, not source
    } else if (/\.tsx?$/.test(entry) && !/\.spec\.tsx?$/.test(entry) && entry !== 'components.d.ts') {
      out.push(full);
    }
  }
  return out;
};

/** Every `@Event({...})` / `@Event()` declaration with its declared options. */
const declarations = (() => {
  const found: { file: string; name: string; options: string }[] = [];
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
        options,
      });
    }
  }
  return found;
})();

const internalNames = new Set<string>(Object.values(INTERNAL_EVENTS));
const publicNames = new Set<string>(Object.values(PUBLIC_EVENTS));

describe('event containment', () => {
  it('finds the @Event declarations (guards against a broken scan)', () => {
    expect(declarations.length).toBeGreaterThan(100);
  });

  it('declares every internal event with bubbles: false and composed: false', () => {
    const leaking = declarations
      .filter((d) => internalNames.has(d.name))
      .filter((d) => !/bubbles:\s*false/.test(d.options) || !/composed:\s*false/.test(d.options))
      .map((d) => `${d.file} -> ${d.name}`);

    expect(leaking).toEqual([]);
  });

  it('covers every name in the internal registry', () => {
    const declared = new Set(declarations.map((d) => d.name));
    const unused = [...internalNames].filter((n) => !declared.has(n));

    expect(unused).toEqual([]);
  });

  it('keeps every public event reachable from the host page', () => {
    const contained = declarations
      .filter((d) => publicNames.has(d.name))
      .filter((d) => /bubbles:\s*false/.test(d.options) || /composed:\s*false/.test(d.options))
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
      'formControlInput', 'formControlBlur', 'formLoading', 'formCompleted',
      'ownerSubmitted', 'showEvent', 'hideEvent', 'checkboxChanged',
      'fileSelected', 'iframeLoaded', 'selectedQuantityChange',
    ];
    const offenders: string[] = [];
    for (const f of sourceFiles(SRC)) {
      const src = readFileSync(f, 'utf8');
      for (const name of RENAMED) {
        // a quoted name is an event name; a bare identifier is the emitter property
        if (new RegExp("['\"`]" + name + "['\"`]").test(src)) {
          offenders.push(f.slice(SRC.length + 1) + " -> '" + name + "'");
        }
      }
    }
    expect(offenders).toEqual([]);
  });

  it('never references INTERNAL_EVENTS inside an @Event decorator', () => {
    const offenders = sourceFiles(SRC)
      .map((f) => f.slice(SRC.length + 1))
      // the registry spells the mistake out in its own doc comment
      .filter((f) => f !== join('api', 'event-names.ts'))
      .filter((f) => /@Event\([^)]*INTERNAL_EVENTS\./.test(readFileSync(join(SRC, f), 'utf8')));

    expect(offenders).toEqual([]);
  });
});
