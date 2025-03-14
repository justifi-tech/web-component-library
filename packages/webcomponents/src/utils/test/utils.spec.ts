import { CurrencyTypes } from '../../api';
import { formatCurrency } from '../utils';

describe('helpers', () => {
  describe('formatCurrency', () => {
    it('should format cents to dollars with 2 decimal spaces', () => {
      const amount = 100000;
      const result = formatCurrency(amount);
      expect(result).toBe("$1,000.00");
    });

    it('should format cents to dollars with 2 decimal spaces, and include USD if passed', () => {
      const amount = 100000;
      const result = formatCurrency(amount, CurrencyTypes.usd);
      expect(result).toBe("$1,000.00 USD");
    });

    it('should format cents to dollars with 2 decimal spaces, and include USD if passed', () => {
      const amount = 100000;
      const result = formatCurrency(amount, CurrencyTypes.cad);
      expect(result).toBe("$1,000.00 CAD");
    });

    it('should handle negative numbers correctly', () => {
      const amount = -100000;
      const result = formatCurrency(amount);
      expect(result).toBe("-$1,000.00");
    });

    it('should handle zero correctly', () => {
      const amount = 0;
      const result = formatCurrency(amount);
      expect(result).toBe("$0.00");
    });

    it('should not include symbols if omitSymbols arg is true', () => {
      const amount = 100000;
      const result = formatCurrency(amount, undefined, true);
      expect(result).toBe("1,000.00");
    });
  });
});