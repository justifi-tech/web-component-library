export type CountryCode = 'USA' | 'CAN';

import StateOptions from '../../../utils/state-options';
import ProvinceOptions from '../../../utils/province-options';

export const countryLabels = {
	USA: {
		stateLabel: 'State',
		postalLabel: 'Zip Code',
		identityLabel: 'SSN',
		taxIdLabel: 'Tax ID',
	},
	CAN: {
		stateLabel: 'Province',
		postalLabel: 'Postal Code',
		identityLabel: 'SIN',
		taxIdLabel: 'Business Number (BN)',
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