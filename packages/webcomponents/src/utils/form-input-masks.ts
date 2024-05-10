export const PHONE_MASKS = {
  US: '(000) 000-0000',
};

export const TAX_ID_MASKS = { US: '00-0000000' };

export const SSN_MASK = '000-00-0000';

export const CURRENCY_MASK = {
  WHOLE: {
    mask: '$num',
    blocks: {
      num: {
        mask: Number,
        thousandsSeparator: ',',
      }
    }
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