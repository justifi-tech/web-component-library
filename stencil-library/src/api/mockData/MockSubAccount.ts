import { AccountType, ApplicationFeeRate, SubAccount, SubAccountStatusType } from "../SubAccount";

const mockApplicationFeeRates: ApplicationFeeRate[] = [
  {
    id: 'afr_4UEFuq5nmOiYzalV6RgOWR',
    transaction_fee: 125,
    currency: 'usd',
    basis_point_rate: 450,
    rate_type: 'cc',
    created_at: '2022-08-04T20:39:48.422Z',
    updated_at: '2022-08-04T20:39:48.422Z'
  },
  {
    id: 'afr_4UEFuq5nmOiYzalV6RgOWR',
    transaction_fee: 65,
    currency: 'usd',
    basis_point_rate: 0,
    rate_type: 'ach',
    created_at: '2022-08-04T20:39:48.422Z',
    updated_at: '2022-08-04T20:39:48.422Z'
  }
];

const mockSubAccounts = [
  new SubAccount({
    account_type: AccountType.test,
    application_fee_rates: mockApplicationFeeRates,
    created_at: '2022-08-04T20:39:48.422Z',
    currency: 'usd',
    id: 'acc_597EUDlyPqYRaEQiwVuMaB',
    name: 'SubAccount for Automation Partner Platform',
    payout_ready: true,
    platform_account_id: 'acc_4RpG4m5z1gOjti3VecMqfe',
    processing_ready: false,
    status: SubAccountStatusType.enabled,
    updated_at: '2022-08-04T20:39:48.422Z'
  }),
  new SubAccount({
    account_type: AccountType.test,
    application_fee_rates: mockApplicationFeeRates,
    created_at: '2022-07-04T20:39:21.422Z',
    currency: 'usd',
    id: 'acc_597EUDlyPqYRaEQiwVullC',
    name: 'An Awesome SubAccount',
    payout_ready: false,
    platform_account_id: 'acc_4RpG4m5z1gOjti3VecMqfe',
    processing_ready: true,
    status: SubAccountStatusType.disabled,
    updated_at: '2022-07-04T20:39:21.422Z'
  }),
  new SubAccount({
    account_type: AccountType.test,
    application_fee_rates: mockApplicationFeeRates,
    created_at: '2022-07-04T20:39:21.422Z',
    currency: 'usd',
    id: 'acc_597EUDlyPqYRaEQiwFfffpp',
    name: 'Better SubAccount',
    payout_ready: false,
    platform_account_id: 'acc_4RpG4m5z1gOjti3VecMqfe',
    processing_ready: true,
    status: SubAccountStatusType.submitted,
    updated_at: '2022-06-04T20:39:21.422Z'
  }),
  new SubAccount({
    account_type: AccountType.test,
    application_fee_rates: mockApplicationFeeRates,
    created_at: '2022-07-04T20:39:21.422Z',
    currency: 'usd',
    id: 'acc_597EUDlyPqYRaEQiwYucci',
    name: 'Other seller',
    payout_ready: false,
    platform_account_id: 'acc_4RpG4m5z1gOjti3VecMqfe',
    processing_ready: true,
    status: SubAccountStatusType.rejected,
    updated_at: '2022-05-04T20:39:21.422Z'
  }),
  new SubAccount({
    account_type: AccountType.test,
    application_fee_rates: mockApplicationFeeRates,
    created_at: '2022-07-04T20:39:21.422Z',
    currency: 'usd',
    id: 'acc_597EUDlyPqYRaEQiwVullD',
    name: 'Zebra SubAccount',
    payout_ready: false,
    platform_account_id: 'acc_4RpG4m5z1gOjti3VecMqfe',
    processing_ready: true,
    status: SubAccountStatusType.information_needed,
    updated_at: '2022-04-04T20:39:21.422Z'
  }),
  new SubAccount({
    account_type: AccountType.test,
    application_fee_rates: mockApplicationFeeRates,
    created_at: '2022-07-04T20:39:21.422Z',
    currency: 'usd',
    id: 'acc_597EUDlyPqYRaEQiwVullE',
    name: 'Cellar SubAccount',
    payout_ready: false,
    platform_account_id: 'acc_4RpG4m5z1gOjti3VecMqfe',
    processing_ready: true,
    status: SubAccountStatusType.created,
    updated_at: '2022-03-04T20:39:21.422Z'
  })
];

export default mockSubAccounts;