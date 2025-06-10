type IBankAccountBillingInfo = {
  name: string;
  address_line1: string;
  address_line2: string;
  address_city: string;
  address_state: string;
  address_postal_code: string;
};

type IPostalCode = {
  address_postal_code: number;
};

export type IBillingInfo = IPostalCode | IBankAccountBillingInfo;
