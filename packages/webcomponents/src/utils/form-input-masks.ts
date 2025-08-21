export const PHONE_MASKS = {
  US: '(000) 000-0000',
};

export const TAX_ID_MASKS = { US: '00-0000000' };

export const SSN_MASK = '000-00-0000';

// Identity number masks by country
// Supports both long and short country codes for robustness during rollout
export const IDENTITY_MASKS: Record<string, string> = {
  USA: '000-00-0000',
  US: '000-00-0000',
  CAN: '000-000-000',
  CA: '000-000-000',
};

export const CURRENCY_MASK = {
  WHOLE: {
    mask: Number,
    thousandsSeparator: ',',
    normalizeZeros: true,
  },
  DECIMAL: {
    mask: Number,
    scale: 2,
    thousandsSeparator: ',',
    padFractionalZeros: true,
    normalizeZeros: true,
    radix: '.',
  }
};