import { newE2EPage } from '@stencil/core/testing';

describe('justifi-card-form', () => {
  it('should emit "cardFormReady" event when "paymentMethodFormReady" event is fired', async () => {
    const page = await newE2EPage();
    await page.setContent('<justifi-card-form></justifi-card-form>');

    const cardForm = await page.find('justifi-card-form');

    const readyEventSpy = await cardForm.spyOnEvent('cardFormReady');

    const paymentFormElement = await page.find('justifi-payment-method-form');
    paymentFormElement.triggerEvent('paymentMethodFormReady');

    await page.waitForChanges();

    expect(readyEventSpy).toHaveReceivedEventTimes(1);
  });
});
