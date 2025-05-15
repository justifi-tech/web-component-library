import { h } from '@stencil/core';
import Spinner from '../spinner';
import { tableCell } from '../../styles/parts';

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
      <td class="loading-state" part={tableCell} colSpan={columnSpan} style={{ textAlign: 'center' }}>
        <Spinner />
      </td>
    </tr>
  );
};
