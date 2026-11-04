// Canada Post addressing guidelines: a postal code is six characters in the form
// "ANA NAN", with a single space between the Forward Sortation Area and the Local
// Delivery Unit. The first character of the FSA identifies one of 18 geographic
// areas, so D, F, I, O, Q, U, W and Z never appear there.
// https://www.canadapost-postescanada.ca/cpc/en/support/articles/addressing-guidelines/postal-codes.page

export const US_ZIP_REGEX = /^\d{5}(-\d{4})?$/;

export const CA_OR_US_POSTAL_REGEX = /^([ABCEGHJKLMNPRSTVXY]\d[A-Z] \d[A-Z]\d|\d{5}(-\d{4})?)$/i;

// Opening alpha-numeric-alpha is what distinguishes a Canadian code from a US ZIP.
const CA_SHAPE = /^[A-Z]\d[A-Z]/;

export const normalizePostalCode = (value: string): string => {
  if (!value) return value;

  const upper = value.toUpperCase();

  // A US ZIP (or a typo) keeps its characters — only the case is normalized.
  if (!CA_SHAPE.test(upper)) return upper;

  const compact = upper.replace(/[\s-]/g, '');

  return compact.length > 3 ? `${compact.slice(0, 3)} ${compact.slice(3)}` : compact;
};
