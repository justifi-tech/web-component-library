import { h } from '@stencil/core';

export const LoadingState = (columnSpan: number) => (
  <tr>
    <td class="loading-state" part="loading-state-cell" colSpan={columnSpan} style={{ textAlign: 'center' }}>
      <div part="loading-state-spinner" class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </td>
  </tr>
);

export const EmptyState = (columnSpan: number) => (
  <tr>
    <td class="empty-state" part="empty-state" colSpan={columnSpan} style={{ textAlign: 'center' }}>No results</td>
  </tr>
);

export const ErrorState = (columnSpan: number, errorMessage: string) => (
  <tr>
    <td class="error-state" part="error-state" colSpan={columnSpan} data-test-id="table-error-state" style={{ textAlign: 'center' }}>
      An unexpected error occurred: {errorMessage}
    </td>
  </tr>
);
