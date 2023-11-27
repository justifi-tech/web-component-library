import { newSpecPage } from '@stencil/core/testing';
import { SubaccountDetails } from '../subaccount-details';

describe('subaccount-details', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [SubaccountDetails],
      html: `<subaccount-details></subaccount-details>`,
    });
    expect(page.root).toEqualHtml(`
      <subaccount-details>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </subaccount-details>
    `);
  });
});
