import { newE2EPage } from '@stencil/core/testing';

it('should emit "paymentMethodFormReady" when conditions are met', async () => {
  const page = await newE2EPage();
  await page.setContent('<justifi-card-form></justifi-card-form>');

  const cardFormElement = await page.find('justifi-card-form');
  const paymentFormElement = await page.find('justifi-payment-method-form');

  const readyEventSpy = await cardFormElement.spyOnEvent('cardFormReady');

  paymentFormElement.triggerEvent('paymentMethodFormReady');
  await page.waitForChanges();

  expect(readyEventSpy).toHaveReceivedEventTimes(1);
});

it('should emit "paymentMethodFormTokenize" when conditions are met', async () => {
  const page = await newE2EPage();
  await page.setContent('<justifi-card-form></justifi-card-form>');

  const cardFormElement = await page.find('justifi-card-form');
  const paymentFormElement = await page.find('justifi-payment-method-form');

  const tokenizeEventSpy = await cardFormElement.spyOnEvent('cardFormTokenize');

  paymentFormElement.triggerEvent('paymentMethodFormTokenized');
  await page.waitForChanges();

  expect(tokenizeEventSpy).toHaveReceivedEventTimes(1);
});
