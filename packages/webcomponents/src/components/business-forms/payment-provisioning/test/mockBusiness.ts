import { Business, IBusiness } from '../../../../api/Business';
import { CountryCode } from '../../../../utils/country-codes';

/**
 * Creates mock business data with 2-character country codes (as they come from API)
 * This allows us to test the normalization that happens in the Business constructor
 */
export const createMockBusinessData = (countryCode: string): IBusiness => ({
  additional_questions: {},
  associated_accounts: [],
  classification: 'corporation' as any,
  bank_accounts: [],
  created_at: '2023-01-01',
  documents: [],
  doing_business_as: 'Test Business',
  email: 'test@example.com',
  id: 'biz_123',
  industry: 'technology',
  legal_address: {
    line1: '123 Main St',
    city: 'Test City',
    state: 'CA',
    postal_code: '12345',
    country: countryCode, // This will be normalized by Business constructor
  },
  legal_name: 'Test Business LLC',
  metadata: {},
  owners: [],
  phone: '555-555-5555',
  platform_account_id: 'pa_123',
  product_categories: {
    credit: false,
    insurance: false,
    lending: false,
    payment: true,
  },
  representative: null,
  tax_id: '123456789',
  terms_conditions_accepted: false,
  updated_at: '2023-01-01',
  website_url: 'https://example.com',
  date_of_incorporation: '2020-01-01',
  country_of_establishment: countryCode as any, // This will be normalized
});

/**
 * Helper to get normalized country codes as they would appear in real usage
 * This simulates what happens when the Business constructor processes API data
 */
export const getNormalizedCountry = (inputCountryCode: string): CountryCode => {
  const mockBusiness = createMockBusinessData(inputCountryCode);
  const business = new Business(mockBusiness);
  return business.country_of_establishment;
};
