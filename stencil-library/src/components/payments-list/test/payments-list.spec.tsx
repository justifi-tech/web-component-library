import { newSpecPage } from '@stencil/core/testing';
import { PaymentsList } from '../payments-list';

describe('payments-list', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [PaymentsList],
      html: `<payments-list></payments-list>`,
    });
    expect(page.root).toEqualHtml(`
      <payments-list>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </payments-list>
    `);
  });
});
