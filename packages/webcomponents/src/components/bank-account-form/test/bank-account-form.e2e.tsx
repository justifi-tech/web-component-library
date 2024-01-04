import { newE2EPage } from '@stencil/core/testing';

describe('justifi-bank-account-form', () => {
  it('should emit "bankAccountFormReady" event when "paymentMethodFormReady" event is fired', async () => {
    const page = await newE2EPage();
    await page.setContent('<justifi-bank-account-form></justifi-bank-account-form>');

    const bankAccountForm = await page.find('justifi-bank-account-form');

    const readyEventSpy = await bankAccountForm.spyOnEvent('bankAccountFormReady');

    const paymentFormElement = await page.find('justifi-payment-method-form');
    paymentFormElement.triggerEvent('paymentMethodFormReady');

    await page.waitForChanges();

    expect(readyEventSpy).toHaveReceivedEventTimes(1);
  });
});
