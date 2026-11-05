import { normalizePostalCode } from '../postal-code';

describe('normalizePostalCode', () => {
  describe('Canadian postal codes', () => {
    it('uppercases a lowercase code', () => {
      expect(normalizePostalCode('n2b 2a5')).toBe('N2B 2A5');
    });

    it('inserts the space Canada Post requires between the FSA and the LDU', () => {
      expect(normalizePostalCode('n2b2a5')).toBe('N2B 2A5');
    });

    it('replaces a hyphen separator with the canonical space', () => {
      expect(normalizePostalCode('a1a-1a1')).toBe('A1A 1A1');
    });

    it('leaves an already canonical code untouched', () => {
      expect(normalizePostalCode('M5V 2T6')).toBe('M5V 2T6');
    });

    it('keeps characters beyond the sixth rather than silently dropping them', () => {
      expect(normalizePostalCode('a1a1a1x')).toBe('A1A 1A1X');
    });
  });

  describe('partial input, as the user types', () => {
    // The transform runs on every keystroke, so it must not mangle a half-typed value.
    it.each([
      ['n', 'N'],
      ['n2', 'N2'],
      ['n2b', 'N2B'],
      ['n2b2', 'N2B 2'],
      ['n2b 2', 'N2B 2'],
    ])('normalizes %p to %p', (typed, expected) => {
      expect(normalizePostalCode(typed)).toBe(expected);
    });

    it('drops a trailing space until there is something after it', () => {
      expect(normalizePostalCode('n2b ')).toBe('N2B');
    });
  });

  describe('US ZIP codes', () => {
    it('leaves a 5-digit ZIP untouched', () => {
      expect(normalizePostalCode('90210')).toBe('90210');
    });

    it('leaves a ZIP+4 untouched, hyphen included', () => {
      expect(normalizePostalCode('44240-5555')).toBe('44240-5555');
    });
  });

  describe('values that are not postal-code shaped', () => {
    it('uppercases without restructuring', () => {
      expect(normalizePostalCode('aaaaaa1')).toBe('AAAAAA1');
    });

    it('returns an empty string as-is', () => {
      expect(normalizePostalCode('')).toBe('');
    });

    it('returns null and undefined as-is, since yup casts through this transform', () => {
      expect(normalizePostalCode(null as unknown as string)).toBeNull();
      expect(normalizePostalCode(undefined as unknown as string)).toBeUndefined();
    });
  });
});
