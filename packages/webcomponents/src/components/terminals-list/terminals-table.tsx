import { h } from '@stencil/core';
import { MapTerminalStatusToBadge } from './terminals-status';

export const defaultColumnsKeys = 'nickname,provider_id,status';

export const terminalTableColumns = {
  nickname: () => (
    <th part="table-head-cell" scope="col" title="The nickname of the terminal">
      Terminal Nickname
    </th>
  ),
  provider_id: () => (
    <th part="table-head-cell" scope="col" title="The provider ID of the terminal">
      Provider ID
    </th>
  ),
  sub_account_name: () => (
    <th part="table-head-cell" scope="col" title="The sub account associated with the terminal">
      Sub Account
    </th>
  ),
  status: () => (
    <th part="table-head-cell" scope="col" title="The current status of each terminal">
      Status
    </th>
  ),
}

export const terminalTableCells = {
  nickname: (value) => (<td>{value}</td>),
  provider_id: (value) => (<td>{value}</td>),
  sub_account_name: (value) => (<td>{value}</td>),
  status: (value) => (<td innerHTML={MapTerminalStatusToBadge(value)}></td>),
}
