import { newSpecPage } from '@stencil/core/testing';
import { SubaccountsList } from '../subaccounts-list';

describe('subaccounts-list', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [SubaccountsList],
      html: `<subaccounts-list></subaccounts-list>`,
    });
    expect(page.root).toEqualHtml(`
      <subaccounts-list>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </subaccounts-list>
    `);
  });
});
