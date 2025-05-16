import { h } from '@stencil/core';
import {
  table,
  tableRow,
  tableFoot,
  tableFootRow,
  tableFootCell,
  tableHead,
  tableHeadRow
} from '../../styles/parts';

export const TableWrapper = (props, children) => {
  return (
    <div class="table-wrapper" part="table-wrapper" {...props}>
      {children}
    </div>
  );
}

export const TableComponent = (props, children) => {
  return (
    <table class="table table-hover" part={table} {...props}>
      {children}
    </table>
  );
}

export const TableBody = (props, children) => {
  return (
    <tbody class="table-body" {...props}>
      {children}
    </tbody>
  );
}

export const TableRow = (props, children) => {
  return (
    <tr part={tableRow} {...props}>
      {children}
    </tr>
  );
}

export const TableHead = (props, children) => {
  return (
    <thead class="table-head sticky-top" part={tableHead} {...props}>
      {children}
    </thead>
  );
}

export const TableHeadRow = (props, children) => {
  return (
    <tr class="table-light text-nowrap" part={tableHeadRow} {...props}>
      {children}
    </tr>
  );
}

export const TableFoot = (props, children) => {
  return (
    <tfoot class="sticky-bottom" part={tableFoot} {...props}>
      {children}
    </tfoot>
  );
}

export const TableFootRow = (props, children) => {
  return (
    <tr class="table-light align-middle" part={tableFootRow} {...props}>
      {children}
    </tr>
  );
}

export const TableFootCell = (props, children) => {
  return (
    <td part={tableFootCell} {...props}>{children}</td>
  );
}
