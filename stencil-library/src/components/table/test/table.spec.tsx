import { h } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';
import { Table } from '../table';

describe('justifi-table', () => {
  it('does not render properly without columnData', async () => {
    const page = await newSpecPage({
      components: [Table],
      html: `<justifi-table></justifi-table>`,
    });

    const error = page.root.shadowRoot.querySelector('[data-test-id="empty-error-state"]');
    expect(error).toBeTruthy();
  });

  it('stops loading', async () => {
    const page = await newSpecPage({
      components: [Table],
      template: () => <justifi-table columnData={['test', 'test']} loading={false} />
    });

    const loading = page.root.shadowRoot.querySelector('.loading-state');

    expect(loading).toBeNull();
  });

  it('renders the state and displays error message passed', async () => {
    const ERROR_TEXT = 'error-123';
    const page = await newSpecPage({
      components: [Table],
      template: () => <justifi-table columnData={['test', 'test']} loading={false} errorMessage={ERROR_TEXT} />
    });

    const error = page.root.shadowRoot.querySelector('.error-state');
    expect(error).not.toBeNull();

    const errorText = error.innerHTML;
    expect(errorText).toBe(`An unexpected error occurred: ${ERROR_TEXT}`);
  });

  it('renders the pagination bar when pagination is passed', async () => {
    const PAG = {
      amount: 25,
      start_cursor: '',
      end_cursor: '',
      has_previous: false,
      has_next: false,
      onPrev: () => {},
      onNext: () => {}
    };
    const page = await newSpecPage({
      components: [Table],
      template: () => <justifi-table columnData={['test', 'test']} loading={false} paging={PAG} />
    });

    const error = page.root.shadowRoot.querySelector('[part="pagination-bar"]');
    expect(error).not.toBeNull();
  });

  it('has an ID for each row', async () => {
    const page = await newSpecPage({
      components: [Table],
      template: () => <justifi-table entityId={['123']} rowData={[['test']]} columnData={['test', 'test']} loading={false} />
    });

    const row: HTMLElement = page.root.shadowRoot.querySelector('[data-row-entity-id]');
    expect(row).not.toBeNull();
    expect(row.dataset.rowEntityId).toBe('123');
  });
});
