import { newSpecPage } from '@stencil/core/testing';
import { PaymentsList } from '../payments-list';

describe('justifi-payments-list', () => {
  it('renders properly', async () => {
    const page = await newSpecPage({
      components: [PaymentsList],
      html: `<justifi-payments-list></justifi-payments-list>`,
    });

    expect(page.root).toEqualHtml(`
    <justifi-payments-list>
      <mock:shadow-root>
        <justifi-table error-message="Can not fetch any data without an AccountID and an AuthToken">
      </mock:shadow-root>
    </justifi-table>
    `);
  });

  it('stops loading', async () => {
    const page = await newSpecPage({
      components: [PaymentsList],
      html: `<justifi-payments-list></justifi-payments-list>`,
    });

    const loading = page.root.__shadowRoot.querySelector('.loading-state');

    expect(loading).toEqual(null);
  });

  it('renders an error when not given proper auth data', async () => {
    const page = await newSpecPage({
      components: [PaymentsList],
      html: `<justifi-payments-list></justifi-payments-list>`,
    });

    const error = page.root.__shadowRoot.querySelector('.error-state');

    expect(error).toBeDefined();
  });
});
