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

// Errors on [capital]/config/locales/en.yml
// Add more errors as needed
export const API_ERRORS = {
  NOT_AUTHENTICATED: 'not_authenticated',
};

export const API_NOT_AUTHENTICATED_ERROR = {
  error: {
    code: API_ERRORS.NOT_AUTHENTICATED,
    message: 'Not Authenticated',
  },
};
