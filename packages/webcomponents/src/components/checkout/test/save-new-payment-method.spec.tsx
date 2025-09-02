import { newSpecPage } from '@stencil/core/testing';
import { SaveNewPaymentMethod } from '../save-new-payment-method';
import { CheckboxInput } from '../../../ui-components/form/form-control-checkbox';

describe('save-new-payment-method', () => {
  it('renders default label when none provided', async () => {
    const page = await newSpecPage({
      components: [SaveNewPaymentMethod, CheckboxInput],
      html: `<justifi-save-new-payment-method></justifi-save-new-payment-method>`,
    });

    await page.waitForChanges();

    const checkbox = page.root?.shadowRoot?.querySelector('form-control-checkbox') as any;
    expect(checkbox).toBeTruthy();
    expect(checkbox.label).toBe('Save New Payment Method');
  });

  it('renders custom label when provided', async () => {
    const page = await newSpecPage({
      components: [SaveNewPaymentMethod, CheckboxInput],
      html: `<justifi-save-new-payment-method label="Keep this on file"></justifi-save-new-payment-method>`,
    });

    await page.waitForChanges();

    const checkbox = page.root?.shadowRoot?.querySelector('form-control-checkbox') as any;
    expect(checkbox).toBeTruthy();
    expect(checkbox.label).toBe('Keep this on file');
  });
});


