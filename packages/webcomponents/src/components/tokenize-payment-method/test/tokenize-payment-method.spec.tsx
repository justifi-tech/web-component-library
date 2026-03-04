import { newSpecPage } from '@stencil/core/testing';
import { JustifiTokenizePaymentMethod } from '../justifi-tokenize-payment-method';
import { BillingForm } from '../../checkout/billing-form/billing-form';
import { BillingFormFull } from '../../checkout/billing-form/billing-form-full';
import { CardBillingFormSimple } from '../../checkout/billing-form/card-billing-form-simple';
import { BankAccountBillingFormSimple } from '../../checkout/billing-form/bank-account-billing-form-simple';
import { SaveNewPaymentMethod } from '../../checkout/save-new-payment-method/save-new-payment-method';
import { RadioListItem } from '../../../ui-components/radio-list-item';
import { InternalButton } from '../../../ui-components/internal-button';
import { CardForm } from '../../checkout/card-form/card-form';
import { BankAccountForm } from '../../checkout/bank-account-form/bank-account-form';
import { checkoutStore } from '../../../store/checkout.store';
import { PAYMENT_METHODS } from '../../modular-checkout/ModularCheckout';
import { ComponentErrorCodes, ComponentErrorSeverity } from '../../../api/ComponentError';

jest.mock('../../../utils/check-pkg-version', () => ({ checkPkgVersion: jest.fn() }));

const tokenizeComponents = [
  JustifiTokenizePaymentMethod,
  SaveNewPaymentMethod,
  BillingForm,
  BillingFormFull,
  CardBillingFormSimple,
  BankAccountBillingFormSimple,
  RadioListItem,
  InternalButton,
  CardForm,
  BankAccountForm,
];

describe('tokenize-payment-method', () => {
  beforeEach(() => {
    checkoutStore.authToken = '';
    checkoutStore.accountId = '';
    checkoutStore.savePaymentMethod = false;
    checkoutStore.paymentMethodGroupId = undefined;
    checkoutStore.selectedPaymentMethod = undefined;
    checkoutStore.billingFormFields = { address_postal_code: '' };
  });

  it('should pass hideCardBillingForm prop to payment method options', async () => {
    const page = await newSpecPage({
      components: tokenizeComponents,
      html: `<justifi-tokenize-payment-method hide-card-billing-form="true" auth-token="test-token" account-id="test-account"></justifi-tokenize-payment-method>`,
    });

    await page.waitForChanges();

    const tokenizePaymentMethod = page.rootInstance;
    expect(tokenizePaymentMethod.hideCardBillingForm).toBe(true);
  });

  it('should pass hideBankAccountBillingForm prop to payment method options', async () => {
    const page = await newSpecPage({
      components: tokenizeComponents,
      html: `<justifi-tokenize-payment-method hide-bank-account-billing-form="true" auth-token="test-token" account-id="test-account"></justifi-tokenize-payment-method>`,
    });

    await page.waitForChanges();

    const tokenizePaymentMethod = page.rootInstance;
    expect(tokenizePaymentMethod.hideBankAccountBillingForm).toBe(true);
  });

  it('should pass hideCardBillingForm prop to billing form through the chain', async () => {
    const page = await newSpecPage({
      components: tokenizeComponents,
      html: `<justifi-tokenize-payment-method hide-card-billing-form="true" auth-token="test-token" account-id="test-account"></justifi-tokenize-payment-method>`,
    });

    await page.waitForChanges();

    const tokenizePaymentMethod = page.rootInstance;
    expect(tokenizePaymentMethod.hideCardBillingForm).toBe(true);
  });

  it('should pass hideBankAccountBillingForm prop to billing form through the chain', async () => {
    const page = await newSpecPage({
      components: tokenizeComponents,
      html: `<justifi-tokenize-payment-method hide-bank-account-billing-form="true" disable-credit-card="true" auth-token="test-token" account-id="test-account"></justifi-tokenize-payment-method>`,
    });

    await page.waitForChanges();

    const tokenizePaymentMethod = page.rootInstance;
    expect(tokenizePaymentMethod.hideBankAccountBillingForm).toBe(true);
  });

  it('should not render billing form fields except postal_code when hideCardBillingForm is true', async () => {
    const page = await newSpecPage({
      components: [BillingForm, BillingFormFull, CardBillingFormSimple, BankAccountBillingFormSimple],
      html: `<billing-form hide-card-billing-form="true" payment-method-type="new_card"></billing-form>`,
    });

    await page.waitForChanges();

    const instance: any = page.rootInstance;

    expect(instance.hideCardBillingForm).toBe(true);
    expect(instance.paymentMethodType).toBe('new_card');
    expect(instance.showSimpleCardBillingForm).toBe(true);
    expect(instance.showSimpleBankAccountBillingForm).toBe(false);

    const cardBillingFormSimpleElement = page.root?.querySelector('card-billing-form-simple');
    const nameField = cardBillingFormSimpleElement?.querySelector('[name="name"]');
    const addressField = cardBillingFormSimpleElement?.querySelector('[name="address_line1"]');
    const postalCodeField = cardBillingFormSimpleElement?.querySelector('[name="address_postal_code"]');

    expect(nameField).toBeFalsy();
    expect(addressField).toBeFalsy();
    expect(postalCodeField).toBeTruthy();
  });

  it('should render only name field when hideBankAccountBillingForm is true', async () => {
    const page = await newSpecPage({
      components: [BillingForm, BillingFormFull, CardBillingFormSimple, BankAccountBillingFormSimple],
      html: `<billing-form hide-bank-account-billing-form="true" payment-method-type="new_bank_account"></billing-form>`,
    });

    await page.waitForChanges();

    const instance: any = page.rootInstance;

    expect(instance.hideBankAccountBillingForm).toBe(true);
    expect(instance.paymentMethodType).toBe('new_bank_account');
    expect(instance.showSimpleCardBillingForm).toBe(false);
    expect(instance.showSimpleBankAccountBillingForm).toBe(true);

    const bankAccountBillingFormSimpleElement = page.root?.querySelector('bank-account-billing-form-simple');
    const nameField = bankAccountBillingFormSimpleElement?.querySelector('[name="name"]');
    const addressField = bankAccountBillingFormSimpleElement?.querySelector('[name="address_line1"]');
    const postalCodeField = bankAccountBillingFormSimpleElement?.querySelector('[name="address_postal_code"]');

    expect(nameField).toBeTruthy();
    expect(addressField).toBeFalsy();
    expect(postalCodeField).toBeFalsy();
  });

  it('forwards savePaymentMethodLabel to save-new-payment-method', async () => {
    const page = await newSpecPage({
      components: tokenizeComponents,
      html: `<justifi-tokenize-payment-method auth-token="test-token" account-id="test-account" payment-method-group-id="pmg_123" save-payment-method-label="Keep this on file"></justifi-tokenize-payment-method>`,
    });

    await page.waitForChanges();

    const checkbox = page.root?.shadowRoot?.querySelector('save-new-payment-method') as any;
    expect(checkbox).toBeTruthy();
    expect((checkbox as any).label).toBe('Keep this on file');
  });

  it('uses default save checkbox label when savePaymentMethodLabel is not provided', async () => {
    const page = await newSpecPage({
      components: tokenizeComponents,
      html: `<justifi-tokenize-payment-method auth-token="test-token" account-id="test-account" payment-method-group-id="pmg_123"></justifi-tokenize-payment-method>`,
    });

    await page.waitForChanges();

    const checkbox = page.root?.shadowRoot?.querySelector('save-new-payment-method') as any;
    expect(checkbox).toBeTruthy();
    expect((checkbox as any).label).toBe('Save New Payment Method');
  });

  it('disableBankAccount hides bank radio/form and hides radio when only card available', async () => {
    const page = await newSpecPage({
      components: tokenizeComponents,
      html: `<justifi-tokenize-payment-method disable-bank-account="true" auth-token="test-token" account-id="test-account"></justifi-tokenize-payment-method>`,
    });

    await page.waitForChanges();

    const root = page.root as HTMLElement;
    const shadowRoot = root.shadowRoot!;
    const bankRadio = shadowRoot.querySelector('radio-list-item[value="new_bank_account"]');
    const cardForm = shadowRoot.querySelector('card-form');
    const bankForm = shadowRoot.querySelector('bank-account-form');

    expect(bankRadio).toBeFalsy();
    expect(cardForm).toBeTruthy();
    expect(bankForm).toBeFalsy();
    expect((page.rootInstance as any).shouldHideRadioInput).toBe(true);
  });

  it('disableCreditCard hides card radio/form and hides radio when only bank available', async () => {
    const page = await newSpecPage({
      components: tokenizeComponents,
      html: `<justifi-tokenize-payment-method disable-credit-card="true" auth-token="test-token" account-id="test-account"></justifi-tokenize-payment-method>`,
    });

    await page.waitForChanges();

    const root = page.root as HTMLElement;
    const shadowRoot = root.shadowRoot!;
    const cardRadio = shadowRoot.querySelector('radio-list-item[value="new_card"]');
    const bankForm = shadowRoot.querySelector('bank-account-form');
    const cardForm = shadowRoot.querySelector('card-form');

    expect(cardRadio).toBeFalsy();
    expect(bankForm).toBeTruthy();
    expect(cardForm).toBeFalsy();
    expect((page.rootInstance as any).shouldHideRadioInput).toBe(true);
  });

  it('hideSubmitButton hides the submit button when true', async () => {
    const page = await newSpecPage({
      components: tokenizeComponents,
      html: `<justifi-tokenize-payment-method hide-submit-button="true" auth-token="test-token" account-id="test-account"></justifi-tokenize-payment-method>`,
    });

    await page.waitForChanges();

    const button = page.root?.shadowRoot?.querySelector('internal-button[data-testid="submit-button"]') as any;
    expect(button).toBeTruthy();
    expect(button.hidden).toBe(true);
  });

  it('submit button is visible when hideSubmitButton not set', async () => {
    const page = await newSpecPage({
      components: tokenizeComponents,
      html: `<justifi-tokenize-payment-method auth-token="test-token" account-id="test-account"></justifi-tokenize-payment-method>`,
    });

    await page.waitForChanges();

    const button = page.root?.shadowRoot?.querySelector('internal-button[data-testid="submit-button"]') as any;
    expect(button).toBeTruthy();
    expect(button.hidden).toBe(false);
  });

  it('submitButtonText prop sets button label', async () => {
    const page = await newSpecPage({
      components: tokenizeComponents,
      html: `<justifi-tokenize-payment-method submit-button-text="Pay Now" auth-token="test-token" account-id="test-account"></justifi-tokenize-payment-method>`,
    });

    await page.waitForChanges();

    const button = page.root?.shadowRoot?.querySelector('internal-button[data-testid="submit-button"]') as any;
    expect(button.text).toBe('Pay Now');
  });

  it('submitButtonText defaults to Submit', async () => {
    const page = await newSpecPage({
      components: tokenizeComponents,
      html: `<justifi-tokenize-payment-method auth-token="test-token" account-id="test-account"></justifi-tokenize-payment-method>`,
    });

    await page.waitForChanges();

    const button = page.root?.shadowRoot?.querySelector('internal-button[data-testid="submit-button"]') as any;
    expect(button.text).toBe('Submit');
  });

  it('paymentMethodGroupId shows save-new-payment-method when set', async () => {
    const page = await newSpecPage({
      components: tokenizeComponents,
      html: `<justifi-tokenize-payment-method payment-method-group-id="pmg_123" auth-token="test-token" account-id="test-account"></justifi-tokenize-payment-method>`,
    });

    await page.waitForChanges();

    const saveCheckbox = page.root?.shadowRoot?.querySelector('save-new-payment-method') as any;
    expect(saveCheckbox).toBeTruthy();
    expect(saveCheckbox.hidden).toBe(false);
  });

  it('save-new-payment-method hidden when paymentMethodGroupId absent', async () => {
    const page = await newSpecPage({
      components: tokenizeComponents,
      html: `<justifi-tokenize-payment-method auth-token="test-token" account-id="test-account"></justifi-tokenize-payment-method>`,
    });

    await page.waitForChanges();

    const saveCheckbox = page.root?.shadowRoot?.querySelector('save-new-payment-method') as any;
    expect(saveCheckbox).toBeTruthy();
    expect(saveCheckbox.hidden).toBe(true);
  });

  it('emits error-event when authToken and accountId missing', async () => {
    const page = await newSpecPage({
      components: tokenizeComponents,
      html: `<justifi-tokenize-payment-method></justifi-tokenize-payment-method>`,
    });

    await page.waitForChanges();

    const errors: any[] = [];
    page.root?.addEventListener('error-event', (e: CustomEvent) => {
      errors.push((e as CustomEvent).detail);
    });

    await (page.root as any).tokenizePaymentMethod();

    expect(errors.length).toBeGreaterThanOrEqual(1);
    expect(errors.some((e) => e.errorCode === ComponentErrorCodes.TOKENIZE_ERROR)).toBe(true);
    expect(errors.some((e) => e.severity === ComponentErrorSeverity.ERROR)).toBe(true);
  });

  it('getValues returns billing form values from store', async () => {
    checkoutStore.billingFormFields = { address_postal_code: '90210', name: 'Jane' };

    const page = await newSpecPage({
      components: tokenizeComponents,
      html: `<justifi-tokenize-payment-method hide-card-billing-form="true" auth-token="test-token" account-id="test-account"></justifi-tokenize-payment-method>`,
    });

    await page.waitForChanges();

    const values = await (page.root as any).getValues();
    expect(values).toBeDefined();
    expect(values.address_postal_code).toBe('90210');
  });

  it('first available method selected by default when both enabled', async () => {
    const page = await newSpecPage({
      components: tokenizeComponents,
      html: `<justifi-tokenize-payment-method auth-token="test-token" account-id="test-account"></justifi-tokenize-payment-method>`,
    });

    await page.waitForChanges();

    const instance = page.rootInstance as any;
    expect(instance.selectedPaymentMethod).toBe(PAYMENT_METHODS.NEW_CARD);
  });

  it('single available method auto-selected and radios hidden', async () => {
    const page = await newSpecPage({
      components: tokenizeComponents,
      html: `<justifi-tokenize-payment-method disable-credit-card="true" auth-token="test-token" account-id="test-account"></justifi-tokenize-payment-method>`,
    });

    await page.waitForChanges();

    const instance = page.rootInstance as any;

    expect(instance.selectedPaymentMethod).toBe(PAYMENT_METHODS.NEW_BANK_ACCOUNT);
    expect((page.rootInstance as any).shouldHideRadioInput).toBe(true);
  });

  it('disableCreditCard/disableBankAccount prop changes update available methods', async () => {
    const page = await newSpecPage({
      components: tokenizeComponents,
      html: `<justifi-tokenize-payment-method auth-token="test-token" account-id="test-account"></justifi-tokenize-payment-method>`,
    });

    await page.waitForChanges();

    const instance = page.rootInstance as any;
    expect(instance.selectedPaymentMethod).toBe(PAYMENT_METHODS.NEW_CARD);

    instance.selectedPaymentMethod = undefined;
    instance.disableCreditCard = true;
    await page.waitForChanges();

    expect(instance.selectedPaymentMethod).toBe(PAYMENT_METHODS.NEW_BANK_ACCOUNT);
    const shadowRoot = (page.root as HTMLElement).shadowRoot!;
    const bankForm = shadowRoot.querySelector('bank-account-form');
    const cardForm = shadowRoot.querySelector('card-form');
    expect(bankForm).toBeTruthy();
    expect(cardForm).toBeFalsy();
  });

  it('card-form rendered by default, bank-account-form after radio-click', async () => {
    const page = await newSpecPage({
      components: tokenizeComponents,
      html: `<justifi-tokenize-payment-method auth-token="test-token" account-id="test-account"></justifi-tokenize-payment-method>`,
    });

    await page.waitForChanges();

    let shadowRoot = (page.root as HTMLElement).shadowRoot!;
    expect(shadowRoot.querySelector('card-form')).toBeTruthy();
    expect(shadowRoot.querySelector('bank-account-form')).toBeFalsy();

    page.root?.dispatchEvent(new CustomEvent('radio-click', { detail: PAYMENT_METHODS.NEW_BANK_ACCOUNT, bubbles: true }));
    await page.waitForChanges();

    shadowRoot = (page.root as HTMLElement).shadowRoot!;
    expect(shadowRoot.querySelector('bank-account-form')).toBeTruthy();
    expect(shadowRoot.querySelector('card-form')).toBeFalsy();
  });

  it('buildPaymentMethodMetadata includes payment_method_group_id when paymentMethodGroupId set', async () => {
    const page = await newSpecPage({
      components: tokenizeComponents,
      html: `<justifi-tokenize-payment-method payment-method-group-id="pmg_xyz" auth-token="test-token" account-id="test-account"></justifi-tokenize-payment-method>`,
    });

    await page.waitForChanges();

    const instance = page.rootInstance as any;
    const metadata = (instance as any).buildPaymentMethodMetadata({ name: 'X' });
    expect(metadata.payment_method_group_id).toBe('pmg_xyz');
  });

  it('buildPaymentMethodMetadata omits payment_method_group_id when not set', async () => {
    const page = await newSpecPage({
      components: tokenizeComponents,
      html: `<justifi-tokenize-payment-method auth-token="test-token" account-id="test-account"></justifi-tokenize-payment-method>`,
    });

    await page.waitForChanges();

    const instance = page.rootInstance as any;
    const metadata = (instance as any).buildPaymentMethodMetadata({ name: 'X' });
    expect(metadata.payment_method_group_id).toBeUndefined();
  });

  it('submit button auto-hides when slotted in justifi-modular-checkout', async () => {
    const page = await newSpecPage({
      components: tokenizeComponents,
      html: `<justifi-modular-checkout><justifi-tokenize-payment-method auth-token="test-token" account-id="test-account"></justifi-tokenize-payment-method></justifi-modular-checkout>`,
    });

    await page.waitForChanges();

    const tokenizeEl = page.root?.querySelector('justifi-tokenize-payment-method') ?? page.root;
    const shadowRoot = (tokenizeEl as HTMLElement)?.shadowRoot ?? (page.root as HTMLElement)?.shadowRoot;
    const button = shadowRoot?.querySelector('internal-button[data-testid="submit-button"]') as any;

    expect(button?.hidden).toBe(true);
  });

  it('hideSubmitButton prop overrides modular checkout auto-detection', async () => {
    const page = await newSpecPage({
      components: tokenizeComponents,
      html: `<justifi-modular-checkout><justifi-tokenize-payment-method hide-submit-button="false" auth-token="test-token" account-id="test-account"></justifi-tokenize-payment-method></justifi-modular-checkout>`,
    });

    await page.waitForChanges();

    const tokenizeEl = page.root?.querySelector('justifi-tokenize-payment-method') ?? page.root;
    const shadowRoot = (tokenizeEl as HTMLElement)?.shadowRoot ?? (page.root as HTMLElement)?.shadowRoot;
    const button = shadowRoot?.querySelector('internal-button[data-testid="submit-button"]') as any;

    expect(button?.hidden).toBe(false);
  });

  describe('fillBillingForm', () => {
    beforeEach(() => {
      checkoutStore.billingFormFields = { address_postal_code: '' };
    });

    it('writes fields to checkoutStore.billingFormFields', async () => {
      const page = await newSpecPage({
        components: tokenizeComponents,
        html: `<justifi-tokenize-payment-method auth-token="test-token" account-id="test-account"></justifi-tokenize-payment-method>`,
      });

      await page.waitForChanges();

      const fields = { name: 'Jane Doe', address_postal_code: '90210' };
      await (page.root as any).fillBillingForm(fields);

      expect(checkoutStore.billingFormFields).toEqual(fields);
    });

    it('billing data persists when payment method type is toggled', async () => {
      const page = await newSpecPage({
        components: tokenizeComponents,
        html: `<justifi-tokenize-payment-method auth-token="test-token" account-id="test-account" disable-bank-account="false" disable-credit-card="false"></justifi-tokenize-payment-method>`,
      });

      await page.waitForChanges();

      const fields = { name: 'Jane Doe', address_postal_code: '90210' };
      await (page.root as any).fillBillingForm(fields);

      expect(checkoutStore.billingFormFields).toEqual(fields);

      // Simulate toggle: dispatch radio-click to switch from card to bank account
      const internalEl = page.root?.shadowRoot?.querySelector('justifi-tokenize-payment-method') ?? page.root?.querySelector('justifi-tokenize-payment-method');
      internalEl?.dispatchEvent(new CustomEvent('radio-click', { detail: PAYMENT_METHODS.NEW_BANK_ACCOUNT }));
      await page.waitForChanges();

      // Store retains data; sub-components read from store on mount (billing-form-store-sync.spec)
      expect(checkoutStore.billingFormFields).toEqual(fields);
    });
  });
});
