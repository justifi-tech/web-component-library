import { object, string } from 'yup';
import { 
  cityValidation,
  lineOneValidation, 
  lineTwoValidation,
} from './schema-validations';
import StateOptions from '../../../utils/state-options';
import CanadianProvinceOptions from '../../../utils/canadian-province-options';
import { CountryCode } from '../../../utils/address-form-helpers';
import { transformEmptyString } from './schema-helpers';

// Multi-country state/province validation
export const multiCountryRegionValidation = string()
  .test('valid-region', 'Select a valid state/province', function(value) {
    const { country } = this.parent;
    
    // Let yup handle empty values - return true to allow .nullable() and .required() to work properly
    if (!value) return true;
    
    if (country === CountryCode.USA) {
      return StateOptions.some(option => option.value === value);
    } else if (country === CountryCode.CAN) {
      return CanadianProvinceOptions.some(option => option.value === value);
    }
    
    // Default to US validation
    return StateOptions.some(option => option.value === value);
  })
  .transform(transformEmptyString);

// Multi-country postal code validation
export const multiCountryPostalValidation = string()
  .test('valid-postal', 'Enter valid postal code', function(value) {
    const { country } = this.parent;
    
    // Let yup handle empty values - return true to allow .nullable() and .required() to work properly
    if (!value) return true;
    
    if (country === CountryCode.USA) {
      // US postal code: 12345 or 12345-6789
      return /^[0-9]{5}(-[0-9]{4})?$/.test(value);
    } else if (country === CountryCode.CAN) {
      // Canadian postal code: A1A 1A1 or A1A1A1
      return /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/.test(value);
    }
    
    // Default to US validation
    return /^[0-9]{5}(-[0-9]{4})?$/.test(value);
  })
  .transform(transformEmptyString);

export const addressSchema = (allowOptionalFields?: boolean) => {
  const schema = object({
    line1: lineOneValidation.required('Enter street address'),
    line2: lineTwoValidation.nullable(),
    city: cityValidation.required('Enter city'),
    state: multiCountryRegionValidation.required('Select state/province'),
    postal_code: multiCountryPostalValidation.required('Enter postal code'),
    country: string().required('Select country')
  });

  const easySchema = object({
    line1: lineOneValidation.nullable(),
    line2: lineTwoValidation.nullable(),
    city: cityValidation.nullable(),
    state: multiCountryRegionValidation.nullable(),
    postal_code: multiCountryPostalValidation.nullable(),
    country: string().required('Select country')
  });

  return allowOptionalFields ? easySchema : schema;
};
