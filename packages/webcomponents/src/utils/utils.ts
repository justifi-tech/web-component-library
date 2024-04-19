import { format } from 'date-fns';
import Dinero from 'dinero.js';
import { Address } from '../api/Business';
import { Legal } from '../api/SubAccount';
import StateOptions from './state-options';

export const RegExZip = /^\d{5}/;

export function formatCurrency(amount: number, withSymbol = true): string {
  if (!amount) amount = 0;

  function format(amount: number): string {
    const formattedString = withSymbol ? '$0,0.00' : '0,0.00';
    return Dinero({ amount: amount, currency: 'USD' }).toFormat(
      formattedString
    );
  }

  return amount < 0 ? `(${format(-amount)})` : format(amount);
}

export function formatPercentage(amount: number): string {
  if (!amount) amount = 0;

  function format(amount: number) {
    const number = amount / 100;
    return number.toFixed(2).toString() + '%';
  }

  return format(amount);
}

export function formatDate(dateString: string | Date): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  return format(date, 'MMM d, yyyy');
}

// eg. Oct 9, 2023
export function formatMediumDate(input: string | Date): string {
  // Check if input is a string and convert to Date object
  if (typeof input === 'string') {
    input = new Date(input);
  }

  // Check if input is a valid date
  if (Object.prototype.toString.call(input) === '[object Date]') {
    if (isNaN(input.getTime())) {
      return 'Invalid date';
    }
  } else {
    return 'Invalid input';
  }

  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  };

  return input.toLocaleDateString('en-US', options);
}

export function formatDisplayDate(value: any, endDate: string) {
  const isEndingDate = value === endDate;
  return isEndingDate
    ? 'Today'
    : format(new Date(value.replace(/-/g, '/')), 'MMM d');
}

export function formatTime(dateString: string): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  return format(date, 'h:mmaaa');
}

export function formatTimeSeconds(dateString: string): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  return format(date, 'h:mm:ssaaa');
}

// Receives an Address as input and return a formatted string
// eg. 123 Main St, Scranton, PA 11111
export function formatAddress(address: Address): string {
  return `${address.line1}, ${address.city}, ${address.state} ${address.postal_code}`;
}

export function formatLegalAddress(address: Legal): string {
  return `${address.address_line1}, ${address.address_city}, ${address.address_state}, ${address.address_postal_code}`;
}

export function extractComputedFontsToLoad() {
  const computedStyles = getComputedStyle(document.body);
  return (
    computedStyles
      ?.getPropertyValue('--jfi-load-google-font')
      ?.trim()
      .replace(/'|"/g, '')
      .replace(' ', '+') || null
  );
}

export const MapPaymentStatusToBadge = (status: string) => {
  switch (status) {
    case 'authorized':
      return "<span class='badge bg-primary' title='This card payment was authorized, but not captured. It could still succeed or fail.'>Authorized</span>";
    case 'disputed':
      return "<span class='badge bg-primary' title='The account holder disputed this payment. The amount has been returned and a fee assessed.'>Disputed</span>";
    case 'achFailed':
      return "<span class='badge bg-danger' title='The funds couldn't be collected for this ACH payment (in addition to the original payment, an ACH return and fee will appear in a payout)'>Failed</span>";
    case 'failed':
      return "<span class='badge bg-danger' title='This card payment didn't go through (it won't appear in a payout)'>Failed</span>";
    case 'fully_refunded':
      return "<span class='badge bg-primary' title='The full amount of this payment has been refunded'>Fully Refunded</span>";
    case 'partially_refunded':
      return "<span class='badge bg-primary' title='A portion of this payment has been refunded'>Partially Refunded</span>";
    case 'pending':
      return "<span class='badge bg-secondary' title='This ACH payment was processed, but the funds haven't settled. It could still succeed or fail.'>Pending</span>";
    case 'succeeded':
      return "<span class='badge bg-success' title='This payment was successfully captured'>Successful</span>";
  }
};

export const MapPayoutStatusToBadge = (status: string) => {
  switch (status) {
    case 'canceled':
      return "<span class='badge bg-danger' title='Transfer to your bank account failed'>Canceled</span>";
    case 'failed':
      return "<span class='badge bg-danger' title='Transfer to your bank account failed'>Failed</span>";
    case 'forwarded':
      return "<span class='badge bg-secondary' title='This payout initially failed; the funds have been forwarded to your next successful payout'>Forwarded</span>";
    case 'in_transit':
      return "<span class='badge bg-primary' title='Transfer to your bank account has been initiated'>In Transit</span>";
    case 'paid':
      return "<span class='badge bg-success' title='Successfully deposited into your bank account'>Paid</span>";
    case 'pending':
      return "<span class='badge bg-primary' title='Batched and scheduled to be transferred'>Pending</span>";
    case 'scheduled':
      return "<span class='badge bg-primary' title='Batched and scheduled to be transferred'>Scheduled</span>";
    case 'withdrawn':
      return "<span class='badge bg-success' title='Negative payout balance successfully withdrawn from your bank account'>Withdrawn</span>";
  }
};

export const MapSubAccountStatusToBadge = (status: string) => {
  switch (status) {
    case 'created':
      return "<span class='badge bg-primary' title='This sub account has been created, but we haven't received their onboarding yet'>Canceled</span>";
    case 'submitted':
      return "<span class='badge bg-info' title='We've received this sub account's onboarding and we're reviewing their information'>Submitted</span>";
    case 'information_needed':
      return "<span class='badge bg-warning' title='We've reviewed this sub account's onboarding information and found an issue'>Information Needed</span>";
    case 'enabled':
      return "<span class='badge bg-success' title='This sub account is approved to process payments'>Enabled</span>";
    case 'disabled':
      return "<span class='badge bg-danger' title='This sub account was previously approved, but has since become ineligible to process payments'>Disabled</span>";
    case 'rejected':
      return "<span class='badge bg-danger' title='This sub account didn't pass approval, so they won't be able to process payments'>Rejected</span>";
    case 'archived':
      return "<span class='badge bg-primary' title='This sub account has been archived. They won't be able to process payments unless they are restored'>Archived</span>";
  }
};

/**
 * Converts a snake_case string to a human-readable format by replacing underscores with spaces and capitalizing the first letter of each word.
 *
 * @param snakeCaseStr - The string in snake_case format.
 * @returns The string transformed into a human-readable format.
 *
 * @example
 * const readable = toReadableString('sole_proprietorship');
 * console.log(readable); // Outputs: "Sole Proprietorship"
 */
export function snakeCaseToHumanReadable(snakeCaseStr: string): string {
  if (!snakeCaseStr) return '';
  return snakeCaseStr
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function flattenNestedObject(obj) {
  const result = {};

  for (const key in obj) {
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      const nestedObj = flattenNestedObject(obj[key]);
      for (const nestedKey in nestedObj) {
        result[nestedKey] = nestedObj[nestedKey];
      }
    } else {
      result[key] = obj[key];
    }
  }

  return result;
}
export function composeQueryParams(values: string[]) {
  const queryParams = values.map((value) => {
    if (value === values[0]) {
      return (value = `?${value}`);
    } else {
      return (value = `&${value}`);
    }
  });
  return queryParams.join('');
}

export async function loadFontsOnParent() {
  const parent = document.body;
  const fontsToLoad = extractComputedFontsToLoad();
  if (!parent || !fontsToLoad) {
    return null;
  }

  // Construct the font URL
  const fontHref = `https://fonts.googleapis.com/css2?family=${fontsToLoad}&display=swap`;

  // Check if a link element with the same href already exists
  const existingFontLink = Array.from(document.querySelectorAll('link')).find(
    (link) => link.href === fontHref
  );

  // If the font link already exists, there's no need to append a new one
  if (existingFontLink) {
    return;
  }

  // This approach is needed to load the font in a parent of the component
  const fonts = document.createElement('link');
  fonts.rel = 'stylesheet';
  fonts.href = fontHref;

  parent.append(fonts);
}

export function isEmptyObject(obj) {
  return Object.keys(obj).length === 0 && obj.constructor === Object;
}

export function getStateAbbreviation(stateName: string): string | undefined {
  const state = StateOptions.find(s => s.label === stateName);
  return state ? state.value : stateName;
}
