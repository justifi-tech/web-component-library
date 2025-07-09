export interface ISavedPaymentMethod {
  payment_method_group_id?: string;
}

export interface IPaymentMethodCard {
  address_postal_code: number;
  number: string;
  month: string;
  year: string;
  verification: string;
}

export interface IPaymentMethodBankAccount {
  account_number: string;
  routing_number: string;
  account_type: string;
  account_holder_name: string;
  account_holder_type: string;
  country: string;
  currency: string;
}

export type ISubmitCheckoutArgs =
  | IPaymentMethodCard
  | IPaymentMethodBankAccount;

export type IPaymentMethodMetadata = ISavedPaymentMethod & ISubmitCheckoutArgs;
