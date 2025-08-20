import { CountryCode } from '../../../utils/country-codes';
import StateOptions from '../../../utils/state-options';
import ProvinceOptions from '../../../utils/province-options';
import { businessClassificationOptions } from './business-form-options';

export const countryLabels = {
	USA: {
		stateLabel: 'State',
		postalLabel: 'Zip Code',
		identityLabel: 'SSN',
		identityHelpText: 'Enter your full Social Security Number. It is required for Federal OFAC check.',
		taxIdLabel: 'Tax ID (EIN or SSN)',
		taxIdHelpText: "Employer Identification Numbers (EINs) are nine digits. The federal tax identification number/EIN issued to you by the IRS. It can be found on your tax returns. Enter value without dashes.",
	},
	CAN: {
		stateLabel: 'Province',
		postalLabel: 'Postal Code',
		identityLabel: 'SIN',
		identityHelpText: 'Enter your full Social Insurance Number.',
		taxIdLabel: 'Business Number (BN)',
		taxIdHelpText: 'Business Numbers (BN) are nine digits. Enter value without spaces or dashes.',
	},
} as const;

export const countryOptions = {
	USA: {
		stateOptions: StateOptions,
	},
	CAN: {
		stateOptions: ProvinceOptions,
	},
} as const;

export const countryValidation = {
	USA: {
		postalRegex: /^[0-9]{5}(-[0-9]{4})?$/,
		identityDigits: 9,
		taxIdDigits: 9,
	},
	CAN: {
		postalRegex: /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/,
		identityDigits: 9,
		taxIdDigits: 9,
	},
} as const;

export const getStateValues = (country: CountryCode): string[] =>
	(countryOptions[country].stateOptions || []).map((o: any) => o.value);

// Business structures (placeholder for CAN duplicates USA for now)
export const businessClassificationOptionsUSA = businessClassificationOptions;
export const businessClassificationOptionsCAN = businessClassificationOptions;