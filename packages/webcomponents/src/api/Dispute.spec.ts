import { Dispute, DisputeStatus, IDispute } from './Dispute';

const baseDispute: IDispute = {
  id: 'dp_test',
  amount: 1000,
  currency: 'usd',
  payment_id: 'py_test',
  reason: 'fraudulent',
  due_date: '2026-04-01',
  status: DisputeStatus.needsResponse,
  metadata: null,
  created_at: '2026-03-01T00:00:00Z',
  updated_at: '2026-03-01T00:00:00Z',
};

function makeDispute(status: DisputeStatus): Dispute {
  return new Dispute({ ...baseDispute, status });
}

describe('Dispute', () => {
  describe('needsResponse', () => {
    it('returns true for needs_response status', () => {
      expect(makeDispute(DisputeStatus.needsResponse).needsResponse).toBe(true);
    });

    it.each([DisputeStatus.won, DisputeStatus.lost, DisputeStatus.underReview])(
      'returns false for status %s',
      status => {
        expect(makeDispute(status).needsResponse).toBe(false);
      }
    );
  });

  describe('won', () => {
    it('returns true for won status', () => {
      expect(makeDispute(DisputeStatus.won).won).toBe(true);
    });

    it.each([DisputeStatus.needsResponse, DisputeStatus.lost, DisputeStatus.underReview])(
      'returns false for status %s',
      status => {
        expect(makeDispute(status).won).toBe(false);
      }
    );
  });

  describe('lost', () => {
    it('returns true for lost status', () => {
      expect(makeDispute(DisputeStatus.lost).lost).toBe(true);
    });

    it.each([DisputeStatus.needsResponse, DisputeStatus.won, DisputeStatus.underReview])(
      'returns false for status %s',
      status => {
        expect(makeDispute(status).lost).toBe(false);
      }
    );
  });

  describe('underReview', () => {
    it('returns true for under_review status', () => {
      expect(makeDispute(DisputeStatus.underReview).underReview).toBe(true);
    });

    it.each([DisputeStatus.needsResponse, DisputeStatus.won, DisputeStatus.lost])(
      'returns false for status %s',
      status => {
        expect(makeDispute(status).underReview).toBe(false);
      }
    );
  });
});
