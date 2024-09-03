import { newSpecPage } from '@stencil/core/testing';
import { SubaccountDetails } from '../subaccount-details';

describe('subaccount-details', () => {
  it('fails to render if there is no account id or authtoken', async () => {
    const page = await newSpecPage({
      components: [SubaccountDetails],
      html: `<justifi-subaccount-details></justifi-subaccount-details>`,
    });
    expect(page.root).toMatchSnapshot();
  });
});
