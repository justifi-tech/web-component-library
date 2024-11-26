
export const MapPayoutStatusToBadge = (status: string) => {
  switch (status) {
    case 'canceled':
      return "<span class='badge bg-danger' title='Transfer to your bank account failed'>Canceled</span>";
    case 'failed':
      return "<span class='badge bg-danger' title='Transfer to your bank account failed'>Failed</span>";
    case 'forwarded':
      return "<span class='badge bg-secondary' title='This payout initially failed; the funds have been forwarded to your next successful payout'>Forwarded</span>";
    case 'in_transit':
      return "<span class='badge bg-primary' title='Transfer to your bank account has been initiated'>In Transit</span>";
    case 'paid':
      return "<span class='badge bg-success' title='Successfully deposited into your bank account'>Paid</span>";
    case 'pending':
      return "<span class='badge bg-primary' title='Batched and scheduled to be transferred'>Pending</span>";
    case 'scheduled':
      return "<span class='badge bg-primary' title='Batched and scheduled to be transferred'>Scheduled</span>";
    case 'withdrawn':
      return "<span class='badge bg-success' title='Negative payout balance successfully withdrawn from your bank account'>Withdrawn</span>";
  };
};
