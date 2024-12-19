import { h } from '@stencil/core';
import { tableEmpty } from '../styles/parts';

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
        part={tableEmpty}
        colSpan={columnSpan}
        style={{ textAlign: 'center' }}
      >
        No results
      </td>
    </tr>
  )
}

