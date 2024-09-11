import { h } from '@stencil/core';

interface TableRenderStateProps {
  columnSpan: number;
  isEmpty: boolean;
}

export const TableEmptyState = (props: TableRenderStateProps) => {
  const { columnSpan, isEmpty } = props;

  if (!columnSpan || !isEmpty) {
    return null;
  }

  return (
    <tr>
      <td
        class="empty-state"
        part="empty-state"
        colSpan={columnSpan}
        style={{ textAlign: 'center' }}
      >
        No results
      </td>
    </tr>
  )
}

