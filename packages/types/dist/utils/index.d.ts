import { C as CountryCode } from '../country-codes-JIQ9gy-p.js';

interface StateOption {
    label: string;
    value: string;
}
declare const StateOptions: StateOption[];

declare function getStateAbbreviation(stateName?: string): string | undefined;
declare function filterNumber(num?: string): string;
declare function constructDate(year?: string, month?: string, day?: string): string | undefined;
declare function deconstructDate(formInput: {
    value: string;
}): {
    dob_year: string;
    dob_month: string;
    dob_day: string;
};
declare function normalizeCountry(value?: string | CountryCode): CountryCode;

export { CountryCode, type StateOption, StateOptions, constructDate, deconstructDate, filterNumber, getStateAbbreviation, normalizeCountry };
