import { getRegionOptions, getRegionLabel, getPostalCodeLabel, CountryCode } from '../../../utils/address-form-helpers';
import { numberOnlyHandler } from '../../../ui-components/form/utils';

export interface CountryFormConfig {
  regionOptions: Array<{ label: string; value: string }>;
  regionLabel: string;
  postalCodeLabel: string;
  postalCodeConfig: {
    maxLength: number;
    keyDownHandler?: (event: KeyboardEvent) => void;
  };
  postalCodeHelpText: string;
}

/**
 * Gets country-specific form configuration including region options, labels, and postal code settings
 * @param country - The country code (e.g., 'USA', 'CAN')
 * @returns Object containing regionOptions, regionLabel, postalCodeLabel, and postalCodeConfig
 */
export function getCountryFormConfig(country?: string): CountryFormConfig {
  const regionOptions = getRegionOptions(country);
  const regionLabel = getRegionLabel(country);
  const postalCodeLabel = getPostalCodeLabel(country);

  // Configure postal code input based on country
  const postalCodeConfig = country === CountryCode.CAN ? {
    maxLength: 7, // A1A 1A1 with space
    keyDownHandler: undefined, // Allow letters for Canadian postal codes
  } : {
    maxLength: 10, // 12345-6789 for US extended zip
    keyDownHandler: numberOnlyHandler,
  };

  // Configure help text based on country
  const postalCodeHelpText = country === CountryCode.CAN ? 'Format: A1A 1A1' : 'Format: 12345 or 12345-6789';

  return {
    regionOptions,
    regionLabel,
    postalCodeLabel,
    postalCodeConfig,
    postalCodeHelpText,
  };
} 