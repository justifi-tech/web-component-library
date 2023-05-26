import { newSpecPage } from '@stencil/core/testing';
import { PaymentForm } from '../payment-form';

describe('justifi-payment-form', () => {
  it('renders with justifi-payment-method-form as a child element', async () => {
    const page = await newSpecPage({
      components: [PaymentForm],
      html: `<payment-form></payment-form>`,
    });
    expect(page.root).toEqualHtml(`
      <payment-form>
      </payment-form>
    `);
  });
});
