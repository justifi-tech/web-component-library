import { newSpecPage } from '@stencil/core/testing';
import { JustifiSaveNewPaymentMethod } from '../save-new-payment-method/justifi-save-new-payment-method';
import { SaveNewPaymentMethod } from '../save-new-payment-method/save-new-payment-method';
import { FormControlCheckbox } from '../../../ui-components/form/form-control-checkbox';
import { checkoutStore } from '../../../store/checkout.store';
import { PAYMENT_METHODS } from '../../modular-checkout/ModularCheckout';

describe('save-new-payment-method', () => {
  it('renders default label when none provided', async () => {
    const page = await newSpecPage({
      components: [JustifiSaveNewPaymentMethod, SaveNewPaymentMethod, FormControlCheckbox],
      html: `<justifi-save-new-payment-method></justifi-save-new-payment-method>`,
    });

    await page.waitForChanges();

    const checkbox = page.root?.shadowRoot?.querySelector('form-control-checkbox') as any;
    expect(checkbox).toBeTruthy();
    expect(checkbox.label).toBe('Save New Payment Method');
  });

  it('renders custom label when provided', async () => {
    const page = await newSpecPage({
      components: [JustifiSaveNewPaymentMethod, SaveNewPaymentMethod, FormControlCheckbox],
      html: `<justifi-save-new-payment-method label="Keep this on file"></justifi-save-new-payment-method>`,
    });

    await page.waitForChanges();

    const checkbox = page.root?.shadowRoot?.querySelector('form-control-checkbox') as any;
    expect(checkbox).toBeTruthy();
    expect(checkbox.label).toBe('Keep this on file');
  });

  describe('visibility by selected payment method', () => {
    afterEach(() => {
      checkoutStore.selectedPaymentMethod = undefined;
    });

    const getInner = async () => {
      const page = await newSpecPage({
        components: [JustifiSaveNewPaymentMethod, SaveNewPaymentMethod, FormControlCheckbox],
        html: `<justifi-save-new-payment-method></justifi-save-new-payment-method>`,
      });
      await page.waitForChanges();
      return { page, inner: page.root?.shadowRoot?.querySelector('save-new-payment-method') as any };
    };

    it('is hidden when Sezzle is selected', async () => {
      checkoutStore.selectedPaymentMethod = { type: PAYMENT_METHODS.SEZZLE };
      const { inner } = await getInner();
      expect(inner.hidden).toBe(true);
    });

    it('is visible when a new card is selected', async () => {
      checkoutStore.selectedPaymentMethod = { type: PAYMENT_METHODS.NEW_CARD };
      const { inner } = await getInner();
      expect(inner.hidden).toBeFalsy();
    });
  });
});
