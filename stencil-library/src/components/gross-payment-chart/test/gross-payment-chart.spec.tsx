import { newSpecPage } from '@stencil/core/testing';
import { GrossPaymentChart } from '../gross-payment-chart';

describe('gross-payment-chart', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [GrossPaymentChart],
      html: `<gross-payment-chart></gross-payment-chart>`,
    });
    expect(page.root).toEqualHtml(`
      <gross-payment-chart>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </gross-payment-chart>
    `);
  });
});
