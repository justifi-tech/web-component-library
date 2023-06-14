import { newSpecPage } from '@stencil/core/testing';
import { BillingForm } from '../billing-form';

describe('Billing Form', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [BillingForm],
      html: `<justifi-billing-form />`,
    });
    expect(page.root).toEqualHtml(`
      <justifi-billing-form>
        <mock:shadow-root>
          <fieldset>
          <text-input defaultvalue="" label="Street Address" name="address_line1"></text-input>
          <text-input defaultvalue="" label="Apartment, Suite, etc. (optional)" name="address_line2"></text-input>
          <text-input defaultvalue="" label="City" name="address_city"></text-input>
          <select-input defaultvalue="" label="State" name="address_state"></select-input>
          <text-input defaultvalue="" label="ZIP" name="address_postal_code"></text-input>
          </fieldset>
        </mock:shadow-root>
      </justifi-billing-form>
    `);
  });
  it('has a validate method and is calllable', () => {
    const billingForm = new BillingForm();
    expect(billingForm.validate).toBeDefined();

    const validateSpy = jest.spyOn(billingForm, 'validate');
    billingForm.validate();
    expect(validateSpy).toHaveBeenCalled();
  });
});
