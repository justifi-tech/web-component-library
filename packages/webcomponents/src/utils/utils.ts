import { format } from 'date-fns';
import Dinero from 'dinero.js';
import { Address } from '../api/Business';

export const RegExZip = /^\d{5}/;

export function formatCurrency(
  amount: number,
  withSymbol = true,
  withCurrencyName = false
): string {
  if (!amount) amount = 0;

  function format(amount: number): string {
    const formattedString = withSymbol ? '$0,0.00' : '0,0.00';
    return Dinero({ amount: amount, currency: 'USD' }).toFormat(
      formattedString
    );
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

export const MapPaymentStatusToBadge = (status: string) => {
  switch (status) {
    case 'succeeded':
      return "<span class='badge bg-success' title='This payment was successfully captured'>Succeeded</span>";
    case 'authorized':
      return "<span class='badge bg-primary' title='This card payment was authorized, but not captured. It could still succeed or fail.'>Authorized</span>";
    case 'pending':
      return "<span class='badge bg-primary' title='This ACH payment was processed, but the funds haven't settled. It could still succeed or fail.'>Pending</span>";
    case 'achFailed':
      return "<span class='badge bg-danger' title='The funds couldn't be collected for this ACH payment (in addition to the original payment, an ACH return and fee will appear in a payout)'>Failed</span>";
    case 'failed':
      return "<span class='badge bg-danger' title='This card payment didn't go through (it won't appear in a payout)'>Failed</span>";
    case 'canceled':
      return "<span class='badge bg-danger' title='This payment was canceled'>Canceled</span>";
    case 'disputed':
      return "<span class='badge bg-secondary' title='The account holder disputed this payment. The amount has been returned and a fee assessed.'>Disputed</span>";
    case 'fully_refunded':
      return "<span class='badge bg-secondary' title='The full amount of this payment has been refunded'>Fully Refunded</span>";
    case 'partially_refunded':
      return "<span class='badge bg-secondary' title='A portion of this payment has been refunded'>Partially Refunded</span>";
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

export function isEmptyObject(obj) {
  return Object.keys(obj).length === 0 && obj.constructor === Object;
}

export const isInRange = (num, min, max) => {
  return num >= min && num <= max;
};

// Receives an HTML string and remove the style attributes
export function removeAttribute(htmlString, attribute) {
  // Create a temporary DOM element to parse the HTML string
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = htmlString;

  // Select all elements with a style attribute
  const elementsWithStyle = tempDiv.querySelectorAll(`[${attribute}]`);

  // Remove the style attribute from each element
  elementsWithStyle.forEach((element) => {
    element.removeAttribute(attribute);
  });

  // Return the updated HTML as a string
  return tempDiv.innerHTML;
}

export function addAttribute(htmlString, tagName, attribute, value) {
  // Create a temporary DOM element to parse the HTML string
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = htmlString;

  // Find all elements matching the specified tag name
  const elements = tempDiv.getElementsByTagName(tagName);

  // Add the part attribute to each found element
  Array.from(elements).forEach((element) => {
    element.setAttribute(attribute, value);
  });

  // Return the updated HTML as a string
  return tempDiv.innerHTML;
}

// Receives an HTML string and an array of functions to apply to that string
export function processHTML(htmlString, functions) {
  let processedHTML = htmlString;
  // Apply each function to the HTML string
  functions.forEach((func) => {
    processedHTML = func(processedHTML);
  });

  // Return the updated HTML as a string
  return processedHTML;
}
