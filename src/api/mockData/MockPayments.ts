import { CaptureStrategy, Payment, PaymentStatuses } from '../Payment';

const mockPayments = [
  // payment 0: succeeded
  new Payment({
    account_id: 'acc_5wEk41rFZVPsqK5xQ7K0eG',
    amount: 363393,
    amount_disputed: 0,
    amount_refundable: 363393,
    amount_refunded: 0,
    balance: 363368,
    capture_strategy: CaptureStrategy.automatic,
    captured: true,
    created_at: '2022-01-10T15:29:58.940Z',
    currency: 'usd',
    description: 'Successful Payment',
    disputed: false,
    disputes: [],
    error_code: null,
    error_description: null,
    fee_amount: 25,
    id: 'py_6vbEiTROeuEoA1Hs1s2exQ',
    is_test: false,
    metadata: {
      city: 'Vienna',
      state: 'Nevada',
      customer_id: 234,
      customer_first_name: 'Elvis',
      customer_last_name: 'Presley',
      source: 'app',
      items: [
        {
          name: 'Pullover',
          amount: 4500
        },
        {
          name: 'Jeans',
          amount: 5567
        }
      ]
    },
    payment_intent_id: null,
    payment_method: {
      card: {
        acct_last_four: '6449',
        brand: 'mastercard',
        created_at: '2022-01-13T14:19:11.803Z',
        id: 'pm_7f66GJQoSofG3s9nOHPgaq',
        name: 'Nick Name',
        token: 'fake-token',
        updated_at: '2022-01-13T14:19:11.803Z'
      }
    },
    refunded: false,
    status: PaymentStatuses.succeeded,
    updated_at: '2022-01-10T15:29:58.940Z'
  }),
  // payment 1: fully refunded
  new Payment({
    account_id: 'acc_5wEk41rFZVPsqK5xQ7K0eG',
    amount: 3393,
    amount_disputed: 0,
    amount_refundable: 0,
    amount_refunded: 3393,
    balance: 0,
    capture_strategy: CaptureStrategy.automatic,
    captured: true,
    created_at: '2021-01-10T15:29:58.940Z',
    currency: 'usd',
    description: 'Fully Refunded Payment',
    disputed: false,
    disputes: [],
    error_code: null,
    error_description: null,
    fee_amount: 25,
    id: 'py_22cEiTROeuEoA1Hs1s24ls3',
    is_test: false,
    metadata: null,
    payment_intent_id: null,
    payment_method: {
      card: {
        acct_last_four: '1213',
        brand: 'visa',
        created_at: '2021-01-13T14:19:11.803Z',
        id: 'pm_7f66GJQoSofG3s9nOHPgaq',
        name: 'Good Customer',
        token: 'fake-token',
        updated_at: '2021-01-13T14:19:11.803Z'
      }
    },
    refunded: true,
    status: PaymentStatuses.fully_refunded,
    updated_at: '2021-01-10T15:29:58.940Z'
  }),
  // payment 2: partially refunded
  new Payment({
    account_id: 'acc_5wEk41rFZVPsqK5xQ7K0eG',
    amount: 3393,
    amount_disputed: 0,
    amount_refundable: 3300,
    amount_refunded: 193,
    balance: 3275,
    capture_strategy: CaptureStrategy.automatic,
    captured: true,
    created_at: '2021-11-10T15:29:58.940Z',
    currency: 'usd',
    description: 'Partially Refunded Payment',
    disputed: false,
    disputes: [],
    error_code: null,
    error_description: null,
    fee_amount: 25,
    id: 'py_8reEiTROeuEoA1Hs1s24zue',
    is_test: false,
    metadata: null,
    payment_intent_id: null,
    payment_method: {
      card: {
        acct_last_four: '9780',
        brand: 'american_express',
        created_at: '2021-11-13T14:19:11.803Z',
        id: 'pm_7f66GJQoSofG3s9nOHPgaq',
        name: 'Sal Gleason',
        token: 'fake-token',
        updated_at: '2021-11-13T14:19:11.803Z'
      }
    },
    refunded: true,
    status: PaymentStatuses.partially_refunded,
    updated_at: '2022-01-10T15:29:58.940Z'
  }),
  // payment 3: disputed
  new Payment({
    account_id: 'acc_5wEk41rFZVPsqK5xQ7K0eG',
    amount: 403393,
    amount_disputed: 403393,
    amount_refundable: 0,
    amount_refunded: 0,
    balance: 0,
    capture_strategy: CaptureStrategy.automatic,
    captured: true,
    created_at: '2021-09-10T15:29:58.940Z',
    currency: 'usd',
    description: 'Rustic Marble Pants',
    disputed: true,
    disputes: [{
      amount_cents: 10000,
      created_at: '2021-09-10T16:34:47.940Z',
      currency: 'usd',
      gateway_ref_id: 'dp_4f67775b-d6e0-4c4a-afb0-6ecf2d0df1a8',
      id: 'ed5dfa9d-b29d-4658-b76d-fff0c592171f',
      payment_id: '41ebfb2a-f8c8-4cee-9eca-cb7d86e863bc',
      reason: null,
      status: 'needs_response',
      updated_at: '2021-09-10T16:34:47.940Z'
    }],
    error_code: null,
    error_description: null,
    fee_amount: 35,
    id: 'py_123EiTROeuEoA1Hs1s24r4w',
    is_test: false,
    metadata: null,
    payment_intent_id: null,
    payment_method: {
      card: {
        acct_last_four: '1554',
        brand: 'discover',
        created_at: '2021-09-13T14:19:11.803Z',
        id: 'pm_7f66GJQoSofG3s9nOHPgaq',
        name: 'Sal Gleason',
        token: 'fake-token',
        updated_at: '2021-09-13T14:19:11.803Z'
      }
    },
    refunded: false,
    status: PaymentStatuses.disputed,
    updated_at: '2021-09-10T15:29:58.940Z'
  }),
  // payment 4: failed
  new Payment({
    account_id: 'acc_5wEk41rFZVPsqK5xQ7K0eG',
    amount: 24170,
    amount_disputed: 0,
    amount_refundable: 0,
    amount_refunded: 0,
    balance: 0,
    capture_strategy: CaptureStrategy.automatic,
    captured: false,
    created_at: '2022-01-18T12:54:44.822Z',
    currency: 'usd',
    description: 'Failed Payment',
    disputed: false,
    disputes: [],
    error_code: 'card_declined',
    error_description: 'Your card has insufficient funds.',
    fee_amount: 25,
    id: 'py_6eZAJjYBFZU6LLNzxUDgx9',
    is_test: true,
    metadata: null,
    payment_intent_id: null,
    payment_method: {
      card: {
        acct_last_four: '8774',
        brand: 'diners_club',
        created_at: '2022-01-18T15:07:15.975Z',
        id: 'pm_5uyevnE6o1yl55nRgPWXXL',
        name: 'Minnie Bernhard',
        token: 'fake-token',
        updated_at: '2022-01-18T15:07:15.975Z'
      },
    },
    refunded: false,
    status: PaymentStatuses.failed,
    updated_at: '2022-01-18T12:54:44.822Z'
  })
];

export default mockPayments;
