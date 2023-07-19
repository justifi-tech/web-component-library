import { newSpecPage } from '@stencil/core/testing';
import { PaymentsList } from '../payments-list';

describe('justifi-payments-list', () => {
  it('renders properly', async () => {
    const page = await newSpecPage({
      components: [PaymentsList],
      html: `<justifi-payments-list></justifi-payments-list>`,
    });

    expect(page.root).toEqualHtml(`
    <justifi-payments-list exportparts="
        table-head,table-head-row,table-head-cell,table-body,table-row,table-cell,
        loading-state-cell,loading-state-spinner,error-state,empty-state,
        pagination-bar,arrow,arrow-left,arrow-right,arrow-disabled
      ">
      <mock:shadow-root>
        <table class="table">
          <thead class="table-head" part="table-head">
            <tr part="table-head-row">
              <th part="table-head-cell" scope="col" title="The date and time each payment was made">
                Made on
              </th>
              <th part="table-head-cell" scope="col" title="The dollar amount of each payment">
                Amount
              </th>
              <th part="table-head-cell" scope="col">
                Description
              </th>
              <th part="table-head-cell" scope="col">
                Cardholder
              </th>
              <th part="table-head-cell" scope="col">
                Payment Method
              </th>
              <th part="table-head-cell" scope="col">
                Status
              </th>
              <th part="table-head-cell" scope="col">
                Payment ID
              </th>
            </tr>
          </thead>
          <tbody class="table-body" part="table-body">
            <tr>
              <td class="error-state" colspan="8" part="error-state" style="text-align: center;">
                An unexpected error occurred: Can not fetch any data without an AccountID and an AuthToken
              </td>
            </tr>
          </tbody>
        </table>
        <div class="pagination-bar" part="pagination-bar">
          <button class="disabled pagination-btn pagination-prev-btn" disabled="" part="arrow,arrow-left,arrow-disabled">
            ←
          </button>
          <button class="disabled pagination-btn pagination-next-btn" disabled="" part="arrow,arrow-right,arrow-disabled">
            →
          </button>
        </div>
      </mock:shadow-root>
    </justifi-payments-list>
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
