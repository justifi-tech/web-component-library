import { format } from 'date-fns';
import Dinero from 'dinero.js';

export function formatCurrency(amount: number, withSymbol = true): string {
  if (!amount) amount = 0;

  function format(amount: number): string {
    const formattedString = withSymbol ? '$0,0.00' : '0,0.00';
    return Dinero({ amount: amount, currency: 'USD' }).toFormat(formattedString);
  }

  return amount < 0 ? `(${format(-amount)})` : format(amount);
}

export function formatDate(dateString: string | Date): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  return format(date, 'MMM d, yyyy');
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

export function extractComputedFontsToLoad() {
  const computedStyles = getComputedStyle(document.body);
  return computedStyles?.getPropertyValue('--jfi-load-google-font')?.trim().replace(/'|"/g, '').replace(' ', '+') || null;
}

export const MapPaymentStatusToBadge = (status: string) => {
  switch (status) {
    case "authorized":
      return "<span class='badge bg-primary' title='This card payment was authorized, but not captured. It could still succeed or fail.'>Authorized</span>";
    case "disputed":
      return "<span class='badge bg-primary' title='The account holder disputed this payment. The amount has been returned and a fee assessed.'>Disputed</span>";
    case "achFailed":
      return "<span class='badge bg-danger' title='The funds couldn't be collected for this ACH payment (in addition to the original payment, an ACH return and fee will appear in a payout)'>Failed</span>";
    case "failed":
      return "<span class='badge bg-danger' title='This card payment didn't go through (it won't appear in a payout)'>Failed</span>";
    case "fully_refunded":
      return "<span class='badge bg-primary' title='The full amount of this payment has been refunded'>Fully Refunded</span>";
    case "partially_refunded":
      return "<span class='badge bg-primary' title='A portion of this payment has been refunded'>Partially Refunded</span>";
    case "pending":
      return "<span class='badge bg-secondary' title='This ACH payment was processed, but the funds haven't settled. It could still succeed or fail.'>Pending</span>";
    case "succeeded":
      return "<span class='badge bg-success' title='This payment was successfully captured'>Successful</span>";
  }
};
