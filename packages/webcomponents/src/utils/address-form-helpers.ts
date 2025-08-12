import StateOptions from './state-options';
import CanadianProvinceOptions from './canadian-province-options';

// Country codes used across forms and validation
export enum CountryCode {
  USA = 'USA',
  CAN = 'CAN',
}

// Default country used when data omits a country
export const DEFAULT_COUNTRY: CountryCode = CountryCode.USA;

// Focused country options for payment provisioning (US and Canada only)
export const PaymentProvisioningCountryOptions = [
  { label: 'United States', value: CountryCode.USA },
  { label: 'Canada', value: CountryCode.CAN },
];

// Get appropriate state/province options based on selected country
export function getRegionOptions(countryCode: string) {
  switch (countryCode) {
    case CountryCode.USA:
      return StateOptions;
    case CountryCode.CAN:
      return CanadianProvinceOptions;
    default:
      return StateOptions; // Default to US states
  }
}

// Get appropriate region label based on selected country
export function getRegionLabel(countryCode: string) {
  switch (countryCode) {
    case CountryCode.USA:
      return 'State';
    case CountryCode.CAN:
      return 'Province/Territory';
    default:
      return 'State';
  }
}

// Get appropriate postal code label based on selected country
export function getPostalCodeLabel(countryCode: string) {
  switch (countryCode) {
    case CountryCode.USA:
      return 'ZIP Code';
    case CountryCode.CAN:
      return 'Postal Code';
    default:
      return 'Postal Code';
  }
} 