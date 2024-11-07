import { h } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';
import { IdentityAddressForm } from '../identity-address-form';
import { IAddress } from '../../../../../api/Business';

describe('identity-address', () => {
  it('should render IdentityAddressForm component', async () => {
    const page = await newSpecPage({
      components: [IdentityAddressForm],
      template: () => (
        <justifi-identity-address-form></justifi-identity-address-form>
      ),
    });
    expect(page.root).toEqualHtml(`
    <justifi-identity-address-form exportparts="label,input,input-invalid">
      <div class="row gy-3">
        <div class="col-12 col-md-8">
          <form-control-text helptext="​​Enter your address exactly as stated on your driver's license. No PO Boxes." label="Street Address" name="line1"></form-control-text>
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
          <form-control-text label="Postal Code" maxlength="5" name="postal_code"></form-control-text>
        </div>

        <div class="col-12">
          <form-control-select disabled="" label="Country" name="country"></form-control-select>
        </div>
      </div>
    </justifi-identity-address-form>
  `);
  });

  it('should render IdentityAddressForm component with defaults', async () => {
    const businessAddress = {
      line1: 'Street 1',
      line2: 'Apartment 1',
      city: 'City',
      state: 'State',
      postal_code: '12345',
      country: 'Country',
    } as IAddress;
    const page = await newSpecPage({
      components: [IdentityAddressForm],
      template: () => (
        <justifi-identity-address-form
          defaultValues={businessAddress}
        ></justifi-identity-address-form>
      ),
    });
    expect(page.root).toEqualHtml(`
    <justifi-identity-address-form exportparts="label,input,input-invalid">
      <div class="gy-3 row">
        <div class="col-12 col-md-8">
          <form-control-text defaultvalue="Street 1" helptext="​​Enter your address exactly as stated on your driver's license. No PO Boxes." label="Street Address" name="line1"></form-control-text>        
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
          <form-control-text defaultvalue="12345" label="Postal Code" maxlength="5" name="postal_code"></form-control-text>
        </div>
        <div class="col-12">
          <form-control-select defaultValue="Country" disabled="" label="Country" name="country"></form-control-select>
        </div>
      </div>
    </justifi-identity-address-form>
  `);
  });
});
