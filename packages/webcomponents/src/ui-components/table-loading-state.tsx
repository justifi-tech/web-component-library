import { h } from '@stencil/core';

interface TableRenderStateProps {
  columnSpan: number;
  isLoading: boolean;
}

export const TableLoadingState = (props: TableRenderStateProps) => {

  const { columnSpan, isLoading } = props;

  if (!columnSpan || !isLoading) {
    return null;
  }

  return (
    <tr>
      <td class="loading-state" part="loading-state-cell" colSpan={columnSpan} style={{ textAlign: 'center' }}>
        <div part="loading-state-spinner" class="spinner-border" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </td>
    </tr>
  );
};
