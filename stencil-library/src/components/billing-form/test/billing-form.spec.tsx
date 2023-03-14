import { newSpecPage } from '@stencil/core/testing';
import { BillingForm } from '../billing-form';

describe('billing-form', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [BillingForm],
      html: `<billing-form></billing-form>`,
    });
    expect(page.root).toEqualHtml(`
      <billing-form>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </billing-form>
    `);
  });
});
