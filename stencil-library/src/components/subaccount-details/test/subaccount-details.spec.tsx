import { newSpecPage } from '@stencil/core/testing';
import { SubaccountDetails } from '../subaccount-details';

describe('subaccount-details', () => {
  it('fails to render if there is no account id or authtoken', async () => {
    const page = await newSpecPage({
      components: [SubaccountDetails],
      html: `<justifi-subaccount-details></justifi-subaccount-details>`,
    });
    expect(page.root).toEqualHtml(`
      <justifi-subaccount-details>
        <mock:shadow-root>
          <main class="d-flex justify-content-center p-4 text-center" part="detail-empty-state" style="font-size: 1.2rem;">
           <div>
             Can not fetch any data without an AccountID and an AuthToken
           </div>
         </main>
       </mock:shadow-root>
      </justifi-subaccount-details>
    `);
  });
});
