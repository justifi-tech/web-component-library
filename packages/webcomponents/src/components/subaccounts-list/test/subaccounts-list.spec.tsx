import { newSpecPage } from '@stencil/core/testing';
import { SubaccountsList } from '../subaccounts-list';

describe('subaccounts-list', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [SubaccountsList],
      html: `<justifi-subaccounts-list></justifi-subaccounts-list>`,
    });

    expect(page.root).toEqualHtml(`
      <justifi-subaccounts-list>
        <mock:shadow-root>
          <justifi-table error-message="Can not fetch any data without an AccountID and an AuthToken">
        </mock:shadow-root>
      </justifi-subaccounts-list>
    `);
  });

  it('stops loading', async () => {
    const page = await newSpecPage({
      components: [SubaccountsList],
      html: `<justifi-subaccounts-list></justifi-subaccounts-list>`,
    });

    const loading = page.root.__shadowRoot.querySelector('.loading-state');

    expect(loading).toEqual(null);
  });

  it('renders an error when not given proper auth data', async () => {
    const page = await newSpecPage({
      components: [SubaccountsList],
      html: `<justifi-subaccounts-list></justifi-subaccounts-list>`,
    });

    const error = page.root.__shadowRoot.querySelector('.error-state');

    expect(error).toBeDefined();
  });

});
