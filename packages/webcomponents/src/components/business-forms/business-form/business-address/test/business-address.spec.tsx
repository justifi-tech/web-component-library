import { h } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';
import { BusinessAddressForm } from '../business-address-form';
import { IAddress } from '../../../../../api/Business';

describe('business-address', () => {
  it('should render BusinessAddressForm component', async () => {
    const page = await newSpecPage({
      components: [BusinessAddressForm],
      template: () => (
        <justifi-business-address-form></justifi-business-address-form>
      ),
    });
    expect(page.root).toEqualHtml(`
    <justifi-business-address-form exportparts="label,input,input-invalid">
      <mock:shadow-root>
        <div class="row gy-3">
          <div class="col-12 col-md-8">
            <form-control-text label="Street Address" name="line1"></form-control-text>
          </div>

          <div class="col-12 col-md-4">
            <form-control-text label="Apartment, Suite, etc. (optional)" name="line2"></form-control-text>
          </div>

          <div class="col-12">
            <form-control-text label="City" name="city"></form-control-text>
          </div>

          <div class="col-12 col-md-6">
             <form-control-select label="State" name="state"></form-control-select>
          </div>

          <div class="col-12 col-md-6">
            <form-control-number label="Postal Code" name="postal_code"></form-control-number>
          </div>
        </div>
      </mock:shadow-root>
    </justifi-business-address-form>
  `);
  });

  it('should render BusinessAddressForm component with defaults', async () => {
    const businessAddress = {
      line1: 'Street 1',
      line2: 'Apartment 1',
      city: 'City',
      state: 'State',
      postal_code: '12345',
      country: 'Country',
    } as IAddress;
    const page = await newSpecPage({
      components: [BusinessAddressForm],
      template: () => (
        <justifi-business-address-form
          defaultValues={businessAddress}
        ></justifi-business-address-form>
      ),
    });
    expect(page.root).toEqualHtml(`
    <justifi-business-address-form exportparts="label,input,input-invalid">
      <mock:shadow-root>
        <div class="gy-3 row">
          <div class="col-12 col-md-8">
            <form-control-text defaultValue="Street 1" label="Street Address" name="line1"></form-control-text>
          </div>
          <div class="col-12 col-md-4">
            <form-control-text defaultValue="Apartment 1" label="Apartment, Suite, etc. (optional)" name="line2"></form-control-text>
          </div>
          <div class="col-12">
            <form-control-text defaultvalue="City" label="City" name="city"></form-control-text>
          </div>
          <div class="col-12 col-md-6">
            <form-control-select defaultValue="State" label="State" name="state"></form-control-select>
          </div>
          <div class="col-12 col-md-6">
            <form-control-number defaultValue="12345" label="Postal Code" name="postal_code"></form-control-number>
          </div>
        </div>
      </mock:shadow-root>
    </justifi-business-address-form>
  `);
  });
});
