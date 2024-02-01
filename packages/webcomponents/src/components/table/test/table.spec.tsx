import { h } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';
import { Table } from '../table';

describe('justifi-table', () => {

  it('enters loading state when loading is true', async () => {
    const page = await newSpecPage({
      components: [Table],
      template: () => <justifi-table columnData={['test', 'test']} loading={true} />
    });

    const loading = page.root.shadowRoot.querySelector('.loading-state');

    expect(loading).toBeTruthy();
  })

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

    const error = await page.root.shadowRoot.querySelector('.error-state');
    console.log(page.root.shadowRoot.innerHTML);
    expect(error).toBeTruthy();

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
      handleClickNext: () => {},
      handleClickPrevious: () => {}
    };
    const page = await newSpecPage({
      components: [Table],
      template: () => <justifi-table columnData={['test', 'test']} loading={false} paging={PAG} />
    });

    const paginationBar = page.root.shadowRoot.querySelector('[part="pagination-bar"]');
    expect(paginationBar).toBeTruthy();
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
