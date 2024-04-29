export class PaymentMethodOption {
  id: string;
  brand?: string;
  acct_last_four?: string;

  constructor(paymentMethod: any) {
    this.id = paymentMethod.id;
    this.brand = paymentMethod.brand;
    this.acct_last_four = paymentMethod.acct_last_four;
  }
};

export enum CardBrandLabels {
  'american_express' = 'American Express',
  'diners_club' = 'Diners Club',
  'discover' = 'Discover',
  'jcb' = 'JCB',
  'mastercard' = 'Mastercard',
  'china_unionpay' = 'UnionPay',
  'visa' = 'Visa',
  'unknown' = 'Unknown'
}