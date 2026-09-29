import { checkoutStore, onAnyChange, onChange } from './checkout.store';

describe('checkout store batch notifications', () => {
  let unsubscribe: () => void;

  afterEach(() => unsubscribe?.());

  it('keeps writes and key listeners synchronous but batches notifications with final state', async () => {
    const handler = jest.fn(() => [checkoutStore.paymentAmount, checkoutStore.totalAmount]);
    const keyHandler = jest.fn();
    const offKey = onChange('paymentAmount', keyHandler);
    unsubscribe = onAnyChange(handler);
    checkoutStore.paymentAmount = 101;
    checkoutStore.totalAmount = 202;
    checkoutStore.paymentAmount = 303;
    expect(keyHandler).toHaveBeenCalledTimes(2);
    expect(checkoutStore.paymentAmount).toBe(303);
    expect(handler).not.toHaveBeenCalled();
    offKey();

    await Promise.resolve();
    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler).toHaveReturnedWith([303, 202]);

    checkoutStore.totalAmount = 404;
    await Promise.resolve();
    expect(handler).toHaveBeenCalledTimes(2);
  });

  it('does not notify for unchanged assignments', async () => {
    const handler = jest.fn();
    unsubscribe = onAnyChange(handler);
    const currentAmount = checkoutStore.paymentAmount;
    checkoutStore.paymentAmount = currentAmount;
    await Promise.resolve();
    expect(handler).not.toHaveBeenCalled();
  });

  it('suppresses queued and future notifications after unsubscribe', async () => {
    const handler = jest.fn();
    unsubscribe = onAnyChange(handler);
    checkoutStore.paymentAmount += 1;
    unsubscribe();
    await Promise.resolve();
    checkoutStore.paymentAmount += 1;
    await Promise.resolve();
    expect(handler).not.toHaveBeenCalled();
  });

  it('schedules a later notification for listener-triggered writes', async () => {
    const handler = jest.fn(() => {
      if (handler.mock.calls.length === 1) checkoutStore.totalAmount += 1;
    });
    unsubscribe = onAnyChange(handler);
    checkoutStore.paymentAmount += 1;
    await Promise.resolve();
    expect(handler).toHaveBeenCalledTimes(1);
    await Promise.resolve();
    expect(handler).toHaveBeenCalledTimes(2);
  });
});
