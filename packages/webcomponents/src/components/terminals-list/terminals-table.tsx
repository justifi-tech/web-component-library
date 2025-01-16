import { h } from '@stencil/core';
import { MapTerminalStatusToBadge } from './terminals-status';
import { getAlternateTableCellPart, tableHeadCell } from '../../styles/parts';
import { Terminal } from '../../api/Terminal';

export const defaultColumnsKeys = 'nickname,provider_id,status';

export const terminalTableColumns = {
  nickname: () => (
    <th part={tableHeadCell} scope="col" title="The nickname associated with the terminal">
      Nickname
    </th>
  ),
  provider_id: () => (
    <th part={tableHeadCell} scope="col" title="The provider ID of the terminal">
      Provider ID
    </th>
  ),
  sub_account_name: () => (
    <th part={tableHeadCell} scope="col" title="The sub account associated with the terminal">
      Sub Account
    </th>
  ),
  status: () => (
    <th part={tableHeadCell} scope="col" title="The current status of each terminal">
      Status
    </th>
  ),
}

export const terminalTableCells = {
  nickname: (terminal: Terminal, index: number) => (
    <td part={getAlternateTableCellPart(index)}>{terminal.nickname}</td>
  ),
  provider_id: (terminal: Terminal, index: number) => (
    <td part={getAlternateTableCellPart(index)}>{terminal.provider_id}</td>
  ),
  sub_account_name: (terminal: Terminal, index: number) => (
    <td part={getAlternateTableCellPart(index)}>{terminal.sub_account_name}</td>
  ),
  status: (terminal: Terminal, index: number) => (
    <td part={getAlternateTableCellPart(index)} innerHTML={MapTerminalStatusToBadge(terminal.status)}></td>
  ),
};
