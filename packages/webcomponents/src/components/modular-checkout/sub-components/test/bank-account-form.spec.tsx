jest.mock('../../../config-provider/config-state', () => ({
  configState: { iframeOrigin: 'https://test-iframe.justifi.ai' },
  waitForConfig: jest.fn().mockResolvedValue(undefined),
}));

import { newSpecPage } from '@stencil/core/testing';
import { JustifiBankAccountForm } from '../justifi-bank-account-form';
import { BankAccountForm } from '../../../checkout/bank-account-form/bank-account-form';
import { AnalyticsService } from '../../../../api/services/analytics.service';
import { checkoutStore } from '../../../../store/checkout.store';

const components = [JustifiBankAccountForm, BankAccountForm];

describe('justifi-bank-account-form', () => {
  beforeEach(() => {
    checkoutStore.checkoutLoaded = false;
    checkoutStore.achPaymentsEnabled = false;
    AnalyticsService.prototype.record = jest.fn().mockResolvedValue(undefined);
  });

  it('forwards showAccountNumberConfirmation to bank-account-form', async () => {
    const page = await newSpecPage({
      components,
      html: `<justifi-bank-account-form show-account-number-confirmation="true"></justifi-bank-account-form>`,
    });

    await page.waitForChanges();

    const leaf = page.root.shadowRoot.querySelector('bank-account-form') as any;

    expect(leaf).not.toBeNull();
    expect(leaf.showAccountNumberConfirmation).toBe(true);
    expect(
      leaf.querySelector('iframe-input[inputId="accountNumberConfirmation"]'),
    ).not.toBeNull();
  });

  it('leaves the confirmation field off by default', async () => {
    const page = await newSpecPage({
      components,
      html: `<justifi-bank-account-form></justifi-bank-account-form>`,
    });

    await page.waitForChanges();

    const leaf = page.root.shadowRoot.querySelector('bank-account-form') as any;

    expect(leaf).not.toBeNull();
    expect(leaf.showAccountNumberConfirmation).toBeFalsy();
    expect(
      leaf.querySelector('iframe-input[inputId="accountNumberConfirmation"]'),
    ).toBeNull();
  });
});
