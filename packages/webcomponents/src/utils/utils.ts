import { format } from 'date-fns';
import Dinero from 'dinero.js';
import { Address } from '../api/Business';

// Currency Formatting

export function formatCurrency(amount: number, withSymbol = true, withCurrencyName = false): string {
  if (!amount) amount = 0;

  function format(amount: number): string {
    const formattedString = withSymbol ? '$0,0.00' : '0,0.00';
    return Dinero({ amount: amount, currency: 'USD' }).toFormat(formattedString);
  }

  const formattedAmount = amount < 0 ? `(${format(-amount)})` : format(amount);
  return withCurrencyName ? `${formattedAmount} USD` : formattedAmount;
}

// Number Formatting

export function formatPercentage(amount: number): string {
  if (!amount) amount = 0;

  function format(amount: number) {
    const number = amount / 100;
    return number.toFixed(2).toString() + '%';
  }

  return format(amount);
}

// Date Formatting and Conversion

export function formatDate(dateString: string | Date): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  return format(date, 'MMM d, yyyy');
}

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

export const convertToUTC = (value: string): string => {
  const dateObj = new Date(value);
  return new Date(dateObj.toUTCString()).toISOString();
};

export const convertUTCToLocal = (dateString: string, showTime: boolean): string => {
  const dateObj = new Date(dateString);
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');
  const hours = String(dateObj.getHours()).padStart(2, '0');
  const minutes = String(dateObj.getMinutes()).padStart(2, '0');
  const seconds = String(dateObj.getSeconds()).padStart(2, '0');

  if (showTime) {
    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
  } else {
    return `${year}-${month}-${day}`;
  }
};

// Address Formatting

export function formatAddress(address: Address): string {
  return `${address.line1}, ${address.city}, ${address.state} ${address.postal_code}`;
}

// String Manipulation

export function snakeCaseToHumanReadable(snakeCaseStr: string): string {
  if (!snakeCaseStr) return '';
  return snakeCaseStr
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function snakeToCamel(str: string): string {
  if (!str) return '';
  return str.replace(/([-_][a-z])/g, (group) =>
    group.toUpperCase().replace('-', '').replace('_', '')
  );
}

// Object Utilities

export function isEmptyObject(obj) {
  return Object.keys(obj).length === 0 && obj.constructor === Object;
}

export const isInRange = (num, min, max) => {
  return num >= min && num <= max;
};

// Font Loading

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
