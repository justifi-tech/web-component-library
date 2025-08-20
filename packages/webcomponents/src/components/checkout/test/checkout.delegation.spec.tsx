import { newSpecPage } from '@stencil/core/testing';
import { Checkout } from '../checkout';

describe('justifi-checkout delegation', () => {
  it('delegates submit to modular checkout', async () => {
    const page = await newSpecPage({
      components: [Checkout],
      html: `<justifi-checkout auth-token="test-token" checkout-id="chk_123"></justifi-checkout>`,
    });

    const instance: any = page.rootInstance;
    instance.modularCheckoutRef = { submitCheckout: jest.fn(), validate: jest.fn().mockResolvedValue(true) } as any;

    await instance.validate();
    expect(instance.modularCheckoutRef.validate).toHaveBeenCalled();

    await instance['submit']({ preventDefault: () => { } } as any);
    expect(instance.modularCheckoutRef.submitCheckout).toHaveBeenCalled();
  });
});


