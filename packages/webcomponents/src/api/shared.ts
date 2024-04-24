export interface BankAccount {
  id: string;
  full_name: string;
  bank_name: string;
  account_number_last4: string;
  routing_number: string;
  country: string;
  currency: string;
  nickname: string;
  account_type: string;
}

export const API_NOT_AUTHENTICATED_ERROR = {
  error: {
    code: 'not_authenticated',
    message: 'Not Authenticated',
  },
};
