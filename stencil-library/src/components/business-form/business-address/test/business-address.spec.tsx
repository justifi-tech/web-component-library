import { h } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';
import { BusinessAddressForm } from '../business-address-form';
import { BusinessAddressFormFields } from '../business-address-form-schema';

describe('business-address', () => {
  it('should render BusinessAddressForm component', async () => {
    const page = await newSpecPage({
      components: [BusinessAddressForm],
      template: () => <justifi-business-address-form></justifi-business-address-form>,
    });
    expect(page.root).toEqualHtml(`
    <justifi-business-address-form exportparts="label,input,input-invalid">
      <div class="gx-2 gy-2 row">
        <div class="col-12">
          <form-control-text label="Street Address" name="line1"></form-control-text>
        </div>
        <div class="col-12">
          <form-control-text label="Apartment, Suite, etc. (optional)" name="line2"></form-control-text>
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

  it('should render BusinessAddressForm component with defaults', async () => {
    const businessAddress = {
      line1: 'Street 1',
      line2: 'Apartment 1',
      city: 'City',
      state: 'State',
      postal_code: '12345',
      country: 'Country',
    } as BusinessAddressFormFields;
    const page = await newSpecPage({
      components: [BusinessAddressForm],
      template: () => <justifi-business-address-form defaultValues={businessAddress}></justifi-business-address-form>,
    });
    expect(page.root).toEqualHtml(`
    <justifi-business-address-form exportparts="label,input,input-invalid">
      <div class="gx-2 gy-2 row">
        <div class="col-12">
          <form-control-text defaultvalue="Street 1" label="Street Address" name="line1"></form-control-text>
        </div>
        <div class="col-12">
          <form-control-text defaultvalue="Apartment 1" label="Apartment, Suite, etc. (optional)" name="line2"></form-control-text>
        </div>
        <div class="col-12">
          <form-control-text defaultvalue="City" label="City" name="city"></form-control-text>
        </div>
        <div class="col-12">
          <form-control-select defaultvalue="State" label="State" name="state"></form-control-select>
        </div>
        <div class="col-12">
          <form-control-text defaultvalue="12345" label="Postal Code" name="postal_code"></form-control-text>
        </div>
      </div>
    </justifi-business-address-form>
  `);
  });
});
