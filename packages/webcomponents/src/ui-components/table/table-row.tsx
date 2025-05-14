import { h } from '@stencil/core';
import { tableRow } from '../../styles/parts';
export const TableRow = (props, children) => {

  return (
    <tr part={tableRow} {...props}>{children}</tr>
  )
}

