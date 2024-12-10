
export const MapPaymentStatusToBadge = (status: string) => {
  switch (status) {
    case 'succeeded':
      return "<span class='badge bg-success' title='This payment was successfully captured'>Succeeded</span>";
    case 'authorized':
      return "<span class='badge bg-primary' title='This card payment was authorized, but not captured. It could still succeed or fail.'>Authorized</span>";
    case 'pending':
      return "<span class='badge bg-primary' title='This ACH payment was processed, but the funds have not settled. It could still succeed or fail.'>Pending</span>";
    case 'achFailed':
      return "<span class='badge bg-danger' title='The funds couldn't be collected for this ACH payment (in addition to the original payment, an ACH return and fee will appear in a payout)'>Failed</span>";
    case 'failed':
      return "<span class='badge bg-danger' title='This card payment did not go through (it will not appear in a payout)'>Failed</span>";
    case 'canceled':
      return "<span class='badge bg-danger' title='This payment was canceled'>Canceled</span>";
    case 'disputed':
      return "<span class='badge bg-secondary' title='The account holder disputed this payment. The amount has been returned and a fee assessed.'>Disputed</span>";
    case 'fully_refunded':
      return "<span class='badge bg-secondary' title='The full amount of this payment has been refunded'>Fully Refunded</span>";
    case 'partially_refunded':
      return "<span class='badge bg-secondary' title='A portion of this payment has been refunded'>Partially Refunded</span>";
  };
};
