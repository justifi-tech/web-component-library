const refundReasonOptions: { label: string, value: string }[] = [
  {
    label: 'Select a reason',
    value: '',
  },
  {
    label: 'Customer requested a refund',
    value: 'customer_request',
  },
  {
    label: 'Customer was double-charged',
    value: 'duplicate',
  },
  {
    label: 'Payment was reported as fraud',
    value: 'fraudulent',
  }
];

export default refundReasonOptions;