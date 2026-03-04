import RefundPaymentSchema from '../refund-payment-schema';

describe('RefundPaymentSchema', () => {
  const schema = RefundPaymentSchema('1000');

  test('rejects amount exceeding max refundable', async () => {
    try {
      await schema.validate({ amount: '999999' });
      fail('Expected validation error');
    } catch (err) {
      expect(err.message).toContain('cannot be more than payment amount');
    }
  });

  test('rejects zero amount', async () => {
    try {
      await schema.validate({ amount: '0' });
      fail('Expected validation error');
    } catch (err) {
      expect(err.message).toBe('Refund amount must be greater than 0');
    }
  });
});
