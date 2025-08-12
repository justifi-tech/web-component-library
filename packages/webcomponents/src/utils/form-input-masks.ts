export const PHONE_MASKS = {
  US: '(000) 000-0000',
};

export const TAX_ID_MASKS = { US: '00-0000000', CA: '000000000' };

export const SSN_MASK = '000-00-0000';

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