import ProvinceOptions from './province-options';
import StateOptions from './state-options';

/**
 * US states/territories + Canadian provinces/territories for checkout billing only.
 * Do not use for USA-only business forms (see country-config).
 */
const checkoutBillingStateOptions = [
  { label: 'Choose state / province', value: '' },
  ...StateOptions.slice(1),
  ...ProvinceOptions.slice(1),
];

export default checkoutBillingStateOptions;
