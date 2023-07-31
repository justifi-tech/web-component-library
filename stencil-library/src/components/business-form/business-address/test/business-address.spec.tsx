import { newSpecPage } from '@stencil/core/testing';
import { BusinessAddressForm } from '../business-address-form';
import { BusinessAddressFormFields } from '../business-address-form-schema';

describe('business-address', () => {
  it('should render BusinessAddressForm component', async () => {
    const page = await newSpecPage({
      components: [BusinessAddressForm],
      html: `<justifi-business-address-form></justifi-business-address-form>`,
    });
    expect(page.root).toEqualHtml(`
    <justifi-business-address-form exportparts="label,input,input-invalid">
      <div class="gx-2 gy-2 row">
        <div class="col-12">
          <form-control-text label="Street Address" name="line1"></form-control-text>
        </div>
        <div class="col-12">
          <form-control-text label="Apt, Suite, etc. (optional)" name="line2"></form-control-text>
        </div>
        <div class="col-12">
          <form-control-text label="City" name="city"></form-control-text>
        </div>
        <div class="col-12">
          <form-control-select label="State" name="state"></form-control-select>
        </div>
        <div class="col-12">
          <form-control-text label="Postal Code" name="postal_code"></form-control-text>
        </div>
      </div>
    </justifi-business-address-form>
  `);
  });
});
