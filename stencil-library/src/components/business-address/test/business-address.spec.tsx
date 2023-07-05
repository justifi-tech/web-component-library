import { newSpecPage } from '@stencil/core/testing';
import { BusinessAddress } from '../business-address';
import { BusinessAddressFormFields } from '../business-address-schema';

describe('business-address', () => {
  it('should render BusinessAddress component', async () => {
    const page = await newSpecPage({
      components: [BusinessAddress],
      html: `<justifi-business-address></justifi-business-address>`,
    });
    expect(page.root).toEqualHtml(`
    <justifi-business-address exportparts="label,input,input-invalid">
      <mock:shadow-root>
        <div class="gx-2 gy-2 row">
          <div class="col-12">
            <text-input defaultvalue="" label="Street Address" name="line1"></text-input>
          </div>
          <div class="col-12">
            <text-input defaultvalue="" label="Apartment, Suite, etc. (optional)" name="line2"></text-input>
          </div>
          <div class="col-12">
            <text-input defaultvalue="" label="City" name="city"></text-input>
          </div>
          <div class="col-12">
            <select-input defaultvalue="" label="State" name="state"></select-input>
          </div>
          <div class="col-12">
            <text-input defaultvalue="" label="Postal Code" name="postal_code"></text-input>
          </div>
        </div>
      </mock:shadow-root>
    </justifi-business-address>
  `);
  });

  it('should handle fieldReceivedInput event', async () => {
    const page = await newSpecPage({
      components: [BusinessAddress],
      html: `<justifi-business-address></justifi-business-address>`,
    });

    let component = page.rootInstance;

    let newEvent = new CustomEvent('fieldReceivedInput', {
      detail: { name: 'city', value: 'New York' },
    });

    component.setFormValue(newEvent);
    expect(component.businessAddress.city).toBe('New York');
  });

  it('should handle form submission and validation', async () => {
    const page = await newSpecPage({
      components: [BusinessAddress],
      html: `<justifi-business-address></justifi-business-address>`,
    });

    let component = page.rootInstance;
    component.businessAddress = {
      line1: 'Street 1',
      line2: 'Apartment 1',
      city: 'City',
      state: 'State',
      postal_code: '12345',
      country: 'Country',
    } as BusinessAddressFormFields;

    let submissionResult = await component.submit();

    expect(submissionResult.isValid).toBe(true);
  });
});
