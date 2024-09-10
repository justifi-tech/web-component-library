import { h } from '@stencil/core';

interface TableRenderStateProps {
  columnSpan: number;
  errorMessage: string;
}

export const TableErrorState = (props: TableRenderStateProps) => {
  const { columnSpan, errorMessage } = props;

  if (!columnSpan || !errorMessage) {
    return null;
  }

  return (
    <tr>
      <td
        class="error-state"
        part="error-state"
        colSpan={columnSpan}
        data-test-id="table-error-state"
        style={{ textAlign: 'center' }}
      >
        An unexpected error occurred: {errorMessage}
      </td>
    </tr>
  );
};
