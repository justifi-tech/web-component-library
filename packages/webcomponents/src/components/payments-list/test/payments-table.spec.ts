import { mapCardBrandToDisplayName } from '../payments-table';

describe('payments-table', () => {
  describe('mapCardBrandToDisplayName', () => {
    it('should map visa to VISA', () => {
      expect(mapCardBrandToDisplayName('visa')).toBe('VISA');
    });

    it('should map mastercard to Mastercard', () => {
      expect(mapCardBrandToDisplayName('mastercard')).toBe('Mastercard');
    });

    it('should map american_express to American Express', () => {
      expect(mapCardBrandToDisplayName('american_express')).toBe('American Express');
    });

    it('should map discover to Discover', () => {
      expect(mapCardBrandToDisplayName('discover')).toBe('Discover');
    });

    it('should map diners_club to Diners Club', () => {
      expect(mapCardBrandToDisplayName('diners_club')).toBe('Diners Club');
    });

    it('should map jcb to JCB', () => {
      expect(mapCardBrandToDisplayName('jcb')).toBe('JCB');
    });

    it('should map china_unionpay to China UnionPay', () => {
      expect(mapCardBrandToDisplayName('china_unionpay')).toBe('China UnionPay');
    });

    it('should map unknown to Unknown', () => {
      expect(mapCardBrandToDisplayName('unknown')).toBe('Unknown');
    });

    it('should handle case insensitive input', () => {
      expect(mapCardBrandToDisplayName('VISA')).toBe('VISA');
      expect(mapCardBrandToDisplayName('MasterCard')).toBe('Mastercard');
      expect(mapCardBrandToDisplayName('AMERICAN_EXPRESS')).toBe('American Express');
    });

    it('should return N/A for undefined input', () => {
      expect(mapCardBrandToDisplayName(undefined)).toBe('N/A');
    });

    it('should return N/A for null input', () => {
      expect(mapCardBrandToDisplayName(null as any)).toBe('N/A');
    });

    it('should return N/A for empty string input', () => {
      expect(mapCardBrandToDisplayName('')).toBe('N/A');
    });

    it('should return original value for unmapped brands', () => {
      expect(mapCardBrandToDisplayName('custom_brand')).toBe('custom_brand');
      expect(mapCardBrandToDisplayName('test_bank')).toBe('test_bank');
    });

    it('should handle bank account brands', () => {
      expect(mapCardBrandToDisplayName('Test Bank')).toBe('Test Bank');
      expect(mapCardBrandToDisplayName('Chase Bank')).toBe('Chase Bank');
    });
  });
});
