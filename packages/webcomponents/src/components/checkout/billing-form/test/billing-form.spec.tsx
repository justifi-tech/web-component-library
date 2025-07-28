import { newSpecPage } from '@stencil/core/testing';
import { BillingForm } from '../billing-form';
import { BillingInformationForm } from '../../../modular-checkout/sub-components/billing-information-form';
import { PostalCodeForm } from '../../../modular-checkout/sub-components/postal-code-form';
import { Header } from '../../../../ui-components/shadow-dom-components/justifi-header';
import { StyledHost } from '../../../../ui-components/styled-host/styled-host';
import { TextInput } from '../../../../ui-components/form/form-control-text';
import { SelectInput } from '../../../../ui-components/form/form-control-select';
import { TooltipComponent } from '../../../../ui-components/form/form-helpers/form-control-tooltip/form-control-tooltip';

describe('billing-form', () => {
  it('fills the form', async () => {
    const page = await newSpecPage({
      components: [
        BillingForm,
        BillingInformationForm,
        PostalCodeForm,
        Header,
        StyledHost,
        TextInput,
        SelectInput,
        TooltipComponent
      ],
      html: `<justifi-billing-form></justifi-billing-form>`,
    });

    const instance: any = page.rootInstance;

    // Wait for component to be fully rendered
    await page.waitForChanges();

    const fields = {
      name: 'John Doe',
      address_line1: 'Street Address',
      address_line2: 'Apartment Address',
      address_city: 'New York',
      address_state: 'NY',
      address_postal_code: '10000',
    };

    await instance.fill(fields);
    const values = await instance.getValues();

    expect(values).toEqual(fields);
  });

  it('validates the form', async () => {
    const page = await newSpecPage({
      components: [
        BillingForm,
        BillingInformationForm,
        PostalCodeForm,
        Header,
        StyledHost,
        TextInput,
        SelectInput,
        TooltipComponent
      ],
      html: `<justifi-billing-form></justifi-billing-form>`,
    });

    const instance: any = page.rootInstance;

    // Wait for component to be fully rendered
    await page.waitForChanges();

    const fields = {
      name: 'John Doe',
      address_line1: 'Street Address',
      address_line2: 'Apartment Address',
      address_city: 'New York',
      address_state: 'NY',
      address_postal_code: '10000',
    };

    await instance.fill(fields);
    const { isValid } = await instance.validate();

    expect(isValid).toBe(true); // Assuming provided fields pass the validation
  });

  it('gets values of the form', async () => {
    const page = await newSpecPage({
      components: [
        BillingForm,
        BillingInformationForm,
        PostalCodeForm,
        Header,
        StyledHost,
        TextInput,
        SelectInput,
        TooltipComponent
      ],
      html: `<justifi-billing-form></justifi-billing-form>`,
    });

    const instance: any = page.rootInstance;

    // Wait for component to be fully rendered
    await page.waitForChanges();

    const fields = {
      name: 'John Doe',
      address_line1: 'Street Address',
      address_line2: 'Apartment Address',
      address_city: 'New York',
      address_state: 'NY',
      address_postal_code: '10000',
    };

    await instance.fill(fields);
    const values = await instance.getValues();

    expect(values).toEqual(fields);
  });
});
