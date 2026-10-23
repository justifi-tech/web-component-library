jest.mock('../../../ui-components/styled-host/styled-host.css', () => '');

import { h } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';
import { JustifiCheckoutsListFilters } from '../checkouts-list-filters';
import { TableFiltersMenu } from '../../filters/table-filters-menu';
import { FormControlSelect } from '../../../ui-components/form/form-control-select';
import { ICheckoutPaymentModeParam } from '../../../api';
import { clearParams, filterParams } from '../checkouts-list-params-state';

const components = [JustifiCheckoutsListFilters, TableFiltersMenu, FormControlSelect];

const renderFilters = () =>
  newSpecPage({
    components,
    autoApplyChanges: true,
    template: () => <justifi-checkouts-list-filters />,
  });

const getPaymentModeSelect = (page: any): HTMLSelectElement =>
  page.root.shadowRoot.querySelector('select[name="payment_mode"]');

describe('justifi-checkouts-list-filters payment mode options', () => {
  afterEach(() => {
    clearParams();
    jest.resetAllMocks();
  });

  it('offers every supported payment mode, including Paypal and Venmo', async () => {
    const page = await renderFilters();

    const options = Array.from(getPaymentModeSelect(page).querySelectorAll('option')).map(
      (option) => ({ label: option.textContent, value: option.getAttribute('value') })
    );

    expect(options).toEqual([
      { label: 'All', value: '' },
      { label: 'E-commerce', value: ICheckoutPaymentModeParam.ecom },
      { label: 'BNPL', value: ICheckoutPaymentModeParam.bnpl },
      { label: 'Apple Pay', value: ICheckoutPaymentModeParam.apple_pay },
      { label: 'Paypal', value: ICheckoutPaymentModeParam.paypal },
      { label: 'Venmo', value: ICheckoutPaymentModeParam.venmo },
    ]);
  });

  it.each([
    ['paypal', ICheckoutPaymentModeParam.paypal],
    ['venmo', ICheckoutPaymentModeParam.venmo],
  ])('sets the payment_mode filter param when %s is selected', async (_name, value) => {
    const page = await renderFilters();

    const select = getPaymentModeSelect(page);
    select.value = value;
    select.dispatchEvent(new Event('input'));
    await page.waitForChanges();

    expect(filterParams.payment_mode).toBe(value);
  });

  it('seeds the payment_mode param from the paymentMode prop', async () => {
    const page = await newSpecPage({
      components,
      autoApplyChanges: true,
      template: () => (
        <justifi-checkouts-list-filters paymentMode={ICheckoutPaymentModeParam.venmo} />
      ),
    });

    expect(getPaymentModeSelect(page).value).toBe(ICheckoutPaymentModeParam.venmo);
  });
});
