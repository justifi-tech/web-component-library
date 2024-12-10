import { format } from 'date-fns';
import Dinero from 'dinero.js';
import { Address } from '../api/Business';

export const RegExZip = /^\d{5}/;

export function formatCurrency(amount: number, withSymbol = true, withCurrencyName = false): string {
  if (!amount) amount = 0;

  function format(amount: number): string {
    const formattedString = withSymbol ? '$0,0.00' : '0,0.00';
    return Dinero({ amount: amount, currency: 'USD' }).toFormat(formattedString);
  }

  const formattedAmount = amount < 0 ? `(${format(-amount)})` : format(amount);
  return withCurrencyName ? `${formattedAmount} USD` : formattedAmount;
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

export function camelToKebab(str: string): string {
  return str.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase();
}

export function snakeToCamel(str: string): string {
  if (!str) return '';
  return str.replace(/([-_][a-z])/g, (group) =>
    group.toUpperCase().replace('-', '').replace('_', '')
  );
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

export const isInRange = (num, min, max) => {
  return num >= min && num <= max;
};
