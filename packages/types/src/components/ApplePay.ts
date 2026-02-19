export enum ApplePayButtonType {
  PLAIN = 'plain',
  BUY = 'buy',
  SET_UP = 'set-up',
  DONATE = 'donate',
  CHECK_OUT = 'check-out',
  BOOK = 'book',
  SUBSCRIBE = 'subscribe',
}

export enum ApplePayButtonStyle {
  BLACK = 'black',
  WHITE = 'white',
  WHITE_OUTLINE = 'white-outline',
}

export interface IApplePayTokenData {
  data: string;
  header: {
    publicKeyHash: string;
    ephemeralPublicKey: string;
    transactionId: string;
  };
  signature: string;
  version: string;
}

export interface IApplePayTokenPaymentMethod {
  displayName: string;
  network: string;
  type: string;
}

export interface IApplePayToken {
  paymentData: IApplePayTokenData;
  paymentMethod: IApplePayTokenPaymentMethod;
  transactionIdentifier: string;
}

export interface IApplePayError {
  code: string;
  message: string;
}
