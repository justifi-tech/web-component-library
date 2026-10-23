import {
  Checkout,
  Completion,
  ICheckout,
  ICheckoutPaymentMode,
  ICheckoutPaymentModeParam,
  ICheckoutStatus,
  ICompletion,
} from './Checkout';

const baseCheckout: ICheckout = {
  id: 'cho_test',
  description: 'test checkout',
  payment_intent_id: 'pi_test',
  account_id: 'acc_test',
  platform_account_id: 'acc_platform',
  payment_amount: 1000,
  payment_client_id: 'client_test',
  payment_description: 'test payment',
  payment_methods: [],
  payment_method_group_id: 'pmg_test',
  payment_settings: {
    ach_payments: true,
    bnpl_payments: true,
    credit_card_payments: true,
    insurance_payments: false,
    bank_account_verification: false,
    apple_payments: true,
    google_payments: true,
    paypal_payments: true,
  },
  total_amount: 1000,
  insurance_amount: 0,
  status: ICheckoutStatus.completed,
  created_at: '2026-01-01T00:00:00Z',
  updated_at: '2026-01-01T00:00:00Z',
};

function makeCompletion(data: Partial<ICompletion>): ICompletion {
  return {
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
    ...data,
  };
}

function makeCheckout(completions?: ICompletion[]): Checkout {
  return new Checkout({ ...baseCheckout, completions });
}

describe('Completion', () => {
  it.each([
    ['paypal', ICheckoutPaymentMode.paypal],
    ['venmo', ICheckoutPaymentMode.venmo],
    ['apple_pay', ICheckoutPaymentMode.apple_pay],
    ['bnpl', ICheckoutPaymentMode.bnpl],
    ['ecom', ICheckoutPaymentMode.ecom],
    ['card_present', ICheckoutPaymentMode.card_present],
  ])('maps api payment_mode %s to its label', (apiValue, expected) => {
    const completion = new Completion(
      makeCompletion({ payment_mode: apiValue as ICheckoutPaymentMode })
    );
    expect(completion.payment_mode).toBe(expected);
  });

  it('leaves payment_mode undefined for an unrecognized api value', () => {
    const completion = new Completion(
      makeCompletion({ payment_mode: 'not_a_mode' as ICheckoutPaymentMode })
    );
    expect(completion.payment_mode).toBeUndefined();
  });
});

describe('Checkout payment_mode', () => {
  it('returns unknown when completions are missing', () => {
    expect(makeCheckout().payment_mode).toBe(ICheckoutPaymentMode.unknown);
  });

  it('returns unknown when completions are empty', () => {
    expect(makeCheckout([]).payment_mode).toBe(ICheckoutPaymentMode.unknown);
  });

  it.each([
    ['paypal', ICheckoutPaymentMode.paypal],
    ['venmo', ICheckoutPaymentMode.venmo],
    ['apple_pay', ICheckoutPaymentMode.apple_pay],
    ['bnpl', ICheckoutPaymentMode.bnpl],
    ['ecom', ICheckoutPaymentMode.ecom],
  ])('returns %s label from the completion payment_mode', (apiValue, expected) => {
    const checkout = makeCheckout([
      makeCompletion({ payment_mode: apiValue as ICheckoutPaymentMode }),
    ]);
    expect(checkout.payment_mode).toBe(expected);
  });

  it('uses the most recently updated completion', () => {
    const checkout = makeCheckout([
      makeCompletion({
        payment_mode: 'venmo' as ICheckoutPaymentMode,
        updated_at: '2026-01-01T00:00:00Z',
      }),
      makeCompletion({
        payment_mode: 'paypal' as ICheckoutPaymentMode,
        updated_at: '2026-02-01T00:00:00Z',
      }),
    ]);
    expect(checkout.payment_mode).toBe(ICheckoutPaymentMode.paypal);
  });

  it('falls back to Card when the payment response carries a card', () => {
    const checkout = makeCheckout([
      makeCompletion({
        payment_response: { data: { payment_method: { card: {} } } },
      }),
    ]);
    expect(checkout.payment_mode).toBe(ICheckoutPaymentMode.card);
  });

  it('falls back to Bank Account when the payment response carries a bank account', () => {
    const checkout = makeCheckout([
      makeCompletion({
        payment_response: { data: { payment_method: { bank_account: {} } } },
      }),
    ]);
    expect(checkout.payment_mode).toBe(ICheckoutPaymentMode.bank_account);
  });

  it('returns null when the completion has neither a mode nor a known payment method', () => {
    const checkout = makeCheckout([
      makeCompletion({ payment_response: { data: { payment_method: {} } } }),
    ]);
    expect(checkout.payment_mode).toBeNull();
  });
});

describe('ICheckoutPaymentModeParam', () => {
  it('exposes paypal and venmo filter params', () => {
    expect(ICheckoutPaymentModeParam.paypal).toBe('paypal');
    expect(ICheckoutPaymentModeParam.venmo).toBe('venmo');
  });
});
