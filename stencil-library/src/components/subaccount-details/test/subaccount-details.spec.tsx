import { newSpecPage } from '@stencil/core/testing';
import { SubaccountDetails } from '../subaccount-details';

describe('subaccount-details', () => {
  it('renders properly', async () => {
    const page = await newSpecPage({
      components: [SubaccountDetails],
      html: `<justifi-subaccount-details></justifi-subaccount-details>`,
    });
    expect(page.root).toEqualHtml(`
      <justifi-subaccount-details>
        <mock:shadow-root>
          <subaccount-business-details></subaccount-business-details>
          <subaccount-representative-details></subaccount-representative-details>
          <subaccount-owners-details></subaccount-owners-details>
          <subaccount-bank-details></subaccount-bank-details>
          <subaccount-terms-details></subaccount-terms-details>
       </mock:shadow-root>
      </justifi-subaccount-details>
    `);
  });
});
