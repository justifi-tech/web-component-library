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

    const loadingSpinner = page.root.shadowRoot.querySelector('.spinner-border');
    expect(loadingSpinner).toBeTruthy();

    const error = await page.root.shadowRoot.querySelector('.error-state');
    expect(error).toBeNull();
  })

  it('renders the empty state when no data is passed', async () => {
    const page = await newSpecPage({
      components: [Table],
      template: () => <justifi-table columnData={['test', 'test']} loading={false} />
    });

    const empty = page.root.shadowRoot.querySelector('.empty-state');
    expect(empty).toBeTruthy();

    const emptyStateMessage = empty.innerHTML;
    expect(emptyStateMessage).toBe('No results');

    const error = await page.root.shadowRoot.querySelector('.error-state');
    expect(error).toBeNull();
  });

  it('renders the state and displays error message passed', async () => {
    const ERROR_TEXT = 'error-123';
    const page = await newSpecPage({
      components: [Table],
      template: () => <justifi-table columnData={['test', 'test']} loading={false} errorMessage={ERROR_TEXT} />
    });

    const loading = page.root.shadowRoot.querySelector('.loading-state');
    expect(loading).toBeNull();

    const error = page.root.shadowRoot.querySelector('.error-state');
    expect(error).toBeTruthy();

    const errorText = error.innerHTML;
    expect(errorText).toBe(`An unexpected error occurred: ${ERROR_TEXT}`);
  });

  it('renders the pagination bar when pagination is passed', async () => {
    const PAG = {
      amount: 50,
      start_cursor: '',
      end_cursor: '',
      has_previous: false,
      has_next: true,
      handleClickNext: () => { },
      handleClickPrevious: () => { }
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
    expect(row).toBeTruthy();
    expect(row.dataset.rowEntityId).toBe('123');

    const loading = page.root.shadowRoot.querySelector('.loading-state');
    expect(loading).toBeNull();

    const empty = page.root.shadowRoot.querySelector('.empty-state');
    expect(empty).toBeNull();

    const error = await page.root.shadowRoot.querySelector('.error-state');
    expect(error).toBeNull();
  });

  it('renders rows and columns based on columnData and rowData', async () => {
    const columnData = ['Name', 'Age'];
    const rowData = [['John Doe', 30], ['Jane Doe', 25]];
    const entityId = ['id1', 'id2']; // Corresponding entity IDs for each row

    const page = await newSpecPage({
      components: [Table],
      template: () => (
        <justifi-table
          columnData={columnData}
          rowData={rowData}
          entityId={entityId}
          loading={false}
        />
      ),
    });

    const rows = page.root.shadowRoot.querySelectorAll('[data-test-id="table-row"]');
    expect(rows.length).toBe(rowData.length);

    rows.forEach((row, index) => {
      const cells = row.querySelectorAll('td');
      expect(cells.length).toBe(columnData.length);
      cells.forEach((cell, cellIndex) => {
        expect(cell.textContent).toBe(String(rowData[index][cellIndex]));
      });
    });
  });
});
