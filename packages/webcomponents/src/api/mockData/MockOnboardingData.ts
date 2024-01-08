import { BusinessStructure } from "../Business";
import { AccountType, BusinessType, IOnboardingPayload } from "../SubAccount"

const MockOnboardingPayload: IOnboardingPayload = {
  business_details: {
    url: "https://justifi.ai",
    phone: '111-222-3333',
    doing_business_as: {
      name: 'Very Good Business'
    },
    email: 'ceo@business.com',
    type: BusinessType.individual,
    structure: BusinessStructure.private_corporation,
    industry: "Landscaping Services",
    legal: {
      name: 'Legal Business Name',
      address_city: "Minneapolis",
      address_line1: "123 Example St",
      address_state: "MN",
      address_country: "USA",
      address_postal_code: "55555"
    }
  },
  representative: {
    name: "Individual Personname",
    title: 'Head of Operations',
    email: "just.an.individual@justifi.ai",
    phone: "6124011111",
    dob_day: "01",
    dob_year: "1980",
    is_owner: false,
    dob_month: "01",
    ssn_last4: "6789",
    address_city: "Minneapolis",
    address_line1: "123 Example St",
    address_state: "MN",
    address_country: "USA",
    address_postal_code: "55555"
  },
  owners: [
    {
      name: "Owner 1",
      title: "CEO",
      email: "owner@company.com",
      identification_number: '555-555-5555',
      dob_day: "01",
      dob_year: "1980",
      dob_month: "01",
      address_city: "Minneapolis",
      address_line1: "123 Example St",
      address_state: "MN",
      address_country: "USA",
      address_postal_code: "55555"
    },
    {
      name: "Owner 2",
      title: "CFO",
      email: "owner@company.com",
      identification_number: '555-555-5555',
      dob_day: "01",
      dob_year: "1980",
      dob_month: "01",
      address_city: "Minneapolis",
      address_line1: "123 Example St",
      address_state: "MN",
      address_country: "USA",
      address_postal_code: "55555"
    },
    {
      name: "Owner 3",
      title: "Owner",
      email: "owner@company.com",
      identification_number: '555-555-5555',
      dob_day: "01",
      dob_year: "1980",
      dob_month: "01",
      address_city: "Minneapolis",
      address_line1: "123 Example St",
      address_state: "MN",
      address_country: "USA",
      address_postal_code: "55555"
    },
    {
      name: "Owner 4",
      title: "Some guy",
      email: "owner@company.com",
      identification_number: '555-555-5555',
      dob_day: "01",
      dob_year: "1980",
      dob_month: "01",
      address_city: "Minneapolis",
      address_line1: "123 Example St",
      address_state: "MN",
      address_country: "USA",
      address_postal_code: "55555"
    },
  ],
  onboarding_version: "v1.0",
  bank_account: {
    bank_name: "Wells Fargo",
    account_type: "checking",
    account_number: "*****1112",
    routing_number: "111111111",
    account_nickname: "My payout account"
  },
  terms_and_conditions: {
    ip: "127.0.0.1",
    accepted: true,
    user_agent: "Safari"
  }
}

export const MockOnboardingData = {
  account_type: AccountType.test,
  payload: MockOnboardingPayload,
  platform_account_id: 'abc123',
  seller_account_id: 'def456',
  sub_account_id: 'ghi789'
};
