import { h } from '@stencil/core';
import { getAlternateTableCellPart, tableHeadCell } from '../../styles/parts';

export const defaultColumnsKeys = 'id,status';

export const terminalOrdersTableColumns = {
  id: () => (
    <th part={tableHeadCell} scope="col" title="The ID of the terminal order">
      ID
    </th>
  ),
  status: () => (
    <th part={tableHeadCell} scope="col" title="The status of the terminal order">
      Status
    </th>
  ),
}

export const terminalOrdersTableCells = {
  id: (terminalOrder, index) => (
    <td part={getAlternateTableCellPart(index)}>{terminalOrder.id}</td>
  ),
  status: (terminalOrder, index) => (
    <td part={getAlternateTableCellPart(index)}>{terminalOrder.status}</td>
  ),
};
