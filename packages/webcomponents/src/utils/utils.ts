import { format } from 'date-fns';
import Dinero from 'dinero.js';
import { Address } from '../api/Business';
import { CurrencyTypes } from '../api/Payment';

// Currency Formatting

export const formatCurrencyNoSymbols = (amount: number): string => {
  const formattedString = '0,0.00';
  const formattedAmount = Dinero({ amount: amount }).toFormat(formattedString);
  return formattedAmount;
}

export const formatCurrency = (amount: number, currency?: CurrencyTypes): string => {
  if (!amount) amount = 0;

  const formattedCurrency = currency?.toUpperCase();
  const formattedAmount = formatCurrencyNoSymbols(amount);

  return currency ? `$${formattedAmount} ${formattedCurrency}` : `$${formattedAmount}`;
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

interface UTCConversionOptions {
  setEndOfDay?: boolean;
  setExactTime?: boolean;
}

export const convertToUTC = (
  dateString: string,
  options: UTCConversionOptions
): string => {
  const { setEndOfDay, setExactTime } = options;
  if (!dateString) return '';

  const dateObj = new Date(dateString);

  if (setEndOfDay) {
    // Adjust the time to be at the very end of the day
    dateObj.setUTCHours(23, 59, 59, 999);
    return new Date(dateObj.toUTCString()).toISOString();
  } else if (setExactTime) {
    return new Date(dateObj.toUTCString()).toISOString();
  }
};

interface localConversionOptions {
  showDisplayDate?: boolean;
  showInputDate?: boolean;
  showTime?: boolean;
  showInputDateTime?: boolean;
}

export const convertToLocal = (
  dateString: string,
  options: localConversionOptions
): string => {
  const { showDisplayDate, showInputDate, showTime, showInputDateTime } =
    options;
  if (!dateString) return '';

  const dateObj = new Date(dateString);
  const localDate = new Date(
    dateObj.toLocaleString('en-US', {
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    })
  );

  if (showDisplayDate) {
    return format(localDate, 'MMM d, yyyy');
  } else if (showInputDate) {
    return format(localDate, 'yyyy-MM-dd');
  } else if (showTime) {
    return format(localDate, 'h:mmaaa');
  } else if (showInputDateTime) {
    return format(localDate, "yyyy-MM-dd'T'HH:mm");
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

export function removeAttribute(htmlString, attribute) {
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = htmlString;
  const elementsWithStyle = tempDiv.querySelectorAll(`[${attribute}]`);
  elementsWithStyle.forEach((element) => {
    element.removeAttribute(attribute);
  });
  return tempDiv.innerHTML;
}

export function addAttribute(htmlString, tagName, attribute, value) {
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = htmlString;
  const elements = tempDiv.getElementsByTagName(tagName);
  Array.from(elements).forEach((element) => {
    element.setAttribute(attribute, value);
  });
  return tempDiv.innerHTML;
}
export function processHTML(htmlString, functions) {
  let processedHTML = htmlString;
  functions.forEach((func) => {
    processedHTML = func(processedHTML);
  });
  return processedHTML;
}
