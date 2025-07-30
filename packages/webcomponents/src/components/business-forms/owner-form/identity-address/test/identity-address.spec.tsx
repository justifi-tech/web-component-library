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
    await page.waitForChanges();

    expect(page.root).toMatchSnapshot();

  });

  it('should render IdentityAddressForm component with defaults', async () => {
    const businessAddress = {
      line1: 'Street 1',
      line2: 'Apartment 1',
      city: 'City',
      state: 'State',
      postal_code: '12345',
      country: 'USA',
    } as IAddress;
    const page = await newSpecPage({
      components: [IdentityAddressForm],
      template: () => (
        <justifi-identity-address-form
          defaultValues={businessAddress}
        ></justifi-identity-address-form>
      ),
    });
    await page.waitForChanges();

    expect(page.root).toMatchSnapshot();

  });
});
