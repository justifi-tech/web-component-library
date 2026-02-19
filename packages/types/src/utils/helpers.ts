import StateOptions from './state-options';
import { CountryCode } from './country-codes';

export function getStateAbbreviation(stateName?: string): string | undefined {
  if (!stateName) return stateName;
  const state = StateOptions.find((s) => s.label === stateName);
  return state ? state.value : stateName;
}

// filterNumber is intended to be used to format a string that contains a single digit to a two digit string.
export function filterNumber(num?: string): string {
  if (!num) return '';
  if (/^\d$/.test(num)) {
    return '0' + num;
  }
  return num;
}

export function constructDate(
  year?: string,
  month?: string,
  day?: string
): string | undefined {
  if (!year || !month || !day) {
    return undefined;
  }

  return `${year}-${filterNumber(month)}-${filterNumber(day)}`;
}

export function deconstructDate(formInput: {
  value: string;
}): { dob_year: string; dob_month: string; dob_day: string } {
  const dateString = formInput.value;
  const [dob_year, dob_month, dob_day] = dateString.split('-');
  return { dob_year, dob_month, dob_day };
}

// Normalize various incoming country representations to strict CountryCode values
export function normalizeCountry(value?: string | CountryCode): CountryCode {
  const v = (value || '').toString().trim().toUpperCase();
  if (v === 'US' || v === 'USA' || v === CountryCode.USA) return CountryCode.USA;
  if (v === 'CA' || v === 'CAN' || v === CountryCode.CAN) return CountryCode.CAN;
  return CountryCode.USA;
}
