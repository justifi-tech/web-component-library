import StateOptions from './state-options';
import CanadianProvinceOptions from './canadian-province-options';

// Focused country options for payment provisioning (US and Canada only)
export const PaymentProvisioningCountryOptions = [
  { label: 'United States', value: 'USA' },
  { label: 'Canada', value: 'CAN' },
];

// Get appropriate state/province options based on selected country
export function getRegionOptions(countryCode: string) {
  switch (countryCode) {
    case 'USA':
      return StateOptions;
    case 'CAN':
      return CanadianProvinceOptions;
    default:
      return StateOptions; // Default to US states
  }
}

// Get appropriate region label based on selected country
export function getRegionLabel(countryCode: string) {
  switch (countryCode) {
    case 'USA':
      return 'State';
    case 'CAN':
      return 'Province/Territory';
    default:
      return 'State';
  }
}

// Get appropriate postal code label based on selected country
export function getPostalCodeLabel(countryCode: string) {
  switch (countryCode) {
    case 'USA':
      return 'ZIP Code';
    case 'CAN':
      return 'Postal Code';
    default:
      return 'Postal Code';
  }
} 