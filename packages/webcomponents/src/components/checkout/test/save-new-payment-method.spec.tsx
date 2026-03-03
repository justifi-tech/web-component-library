import { newSpecPage } from '@stencil/core/testing';
import { JustifiSaveNewPaymentMethod } from '../save-new-payment-method/justifi-save-new-payment-method';
import { SaveNewPaymentMethod } from '../save-new-payment-method/save-new-payment-method';
import { FormControlCheckbox } from '../../../ui-components/form/form-control-checkbox';

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
});


