import { h } from '@stencil/core';
import { getAlternateTableCellPart, tableHeadCell } from '../../styles/parts';
import { convertToLocal } from '../../utils/utils';
import { TerminalOrder } from '../../api';
import { MapTerminalOrderStatusToBadge } from './terminal-order-status';

export const defaultColumnsKeys = 'created_at,updated_at,order_status,quantity';

export const terminalOrdersTableColumns = {
  created_at: () => (
    <th part={tableHeadCell} scope="col" title="The date and time the order was created">
      Created At
    </th>
  ),
  updated_at: () => (
    <th part={tableHeadCell} scope="col" title="The date and time the order was last updated">
      Updated At
    </th>
  ),
  order_status: () => (
    <th part={tableHeadCell} scope="col" title="The current status of the order">
      Order Status
    </th>
  ),
  business_id: () => (
    <th part={tableHeadCell} scope="col" title="The business ID associated with the order">
      Business ID
    </th>
  ),
  provider: () => (
    <th part={tableHeadCell} scope="col" title="The provider associated with the order">
      Provider
    </th>
  ),
  order_type: () => (
    <th part={tableHeadCell} scope="col" title="The type of order">
      Order Type
    </th>
  ),
  quantity: () => (
    <th part={tableHeadCell} scope="col" title="The number of terminals associated with the order">
      Order Quantity
    </th>
  ),
};

export const terminalOrdersTableCells = {
  created_at: (terminalOrder: TerminalOrder, index: number) => (
    <td part={getAlternateTableCellPart(index)}>
      <div class="fw-bold">{convertToLocal(terminalOrder.created_at, { showDisplayDate: true })}</div>
      <div class="fw-bold">{convertToLocal(terminalOrder.created_at, { showTime: true })}</div>
    </td>
  ),
  updated_at: (terminalOrder: TerminalOrder, index: number) => (
    <td part={getAlternateTableCellPart(index)}>
      <div class="fw-bold">{convertToLocal(terminalOrder.updated_at, { showDisplayDate: true })}</div>
      <div class="fw-bold">{convertToLocal(terminalOrder.updated_at, { showTime: true })}</div>
    </td>
  ),
  order_status: (terminalOrder: TerminalOrder, index: number) => (
    <td part={getAlternateTableCellPart(index)}>{MapTerminalOrderStatusToBadge(terminalOrder.order_status)}</td>
  ),
  business_id: (terminalOrder: TerminalOrder, index: number) => (
    <td part={getAlternateTableCellPart(index)}>{terminalOrder.business_id}</td>
  ),
  provider: (terminalOrder: TerminalOrder, index: number) => (
    <td part={getAlternateTableCellPart(index)}>{terminalOrder.provider}</td>
  ),
  order_type: (terminalOrder: TerminalOrder, index: number) => (
    <td part={getAlternateTableCellPart(index)}>{terminalOrder.order_type}</td>
  ),
  quantity: (terminalOrder: TerminalOrder, index: number) => (
    <td part={getAlternateTableCellPart(index)}>{terminalOrder.terminals.length}</td>
  ),
};
