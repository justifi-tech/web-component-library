import { h } from '@stencil/core';
import { MapTerminalStatusToBadge } from './terminals-status';
import { getAlternateTableCellPart, tableHeadCell } from '../../styles/parts';
import { Terminal } from '../../api/Terminal';
import { capitalFirstLetter } from '../../utils/utils';

export const defaultColumnsKeys = 'nickname,provider_serial_number,status';

export const terminalTableColumns = {
  nickname: () => (
    <th part={tableHeadCell} scope="col" title="The nickname associated with the terminal">
      Nickname
    </th>
  ),
  model_name: () => (
    <th part={tableHeadCell} scope="col" title="The model name of the terminal">
      Model Name
    </th>
  ),
  id: () => (
    <th part={tableHeadCell} scope="col" title="The ID of the terminal">
      ID
    </th>
  ),
  provider: () => (
    <th part={tableHeadCell} scope="col" title="The provider of the terminal">
      Provider
    </th>
  ),
  provider_serial_number: () => (
    <th part={tableHeadCell} scope="col" title="The serial number of the terminal">
      Serial Number
    </th>
  ),
  device_id: () => (
    <th part={tableHeadCell} scope="col" title="The device/provider ID of the terminal">
      Device ID
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
  model_name: (terminal: Terminal, index: number) => (
    <td part={getAlternateTableCellPart(index)}>{terminal.model_name}</td>
  ),
  id: (terminal: Terminal, index: number) => (
    <td part={getAlternateTableCellPart(index)}>{terminal.id}</td>
  ),
  provider: (terminal: Terminal, index: number) => (
    <td part={getAlternateTableCellPart(index)}>{capitalFirstLetter(terminal.provider)}</td>
  ),
  provider_serial_number: (terminal: Terminal, index: number) => (
    <td part={getAlternateTableCellPart(index)}>{terminal.provider_serial_number}</td>
  ),
  device_id: (terminal: Terminal, index: number) => (
    <td part={getAlternateTableCellPart(index)}>{terminal.provider_id}</td>
  ),
  sub_account_name: (terminal: Terminal, index: number) => (
    <td part={getAlternateTableCellPart(index)}>{terminal.sub_account_name}</td>
  ),
  status: (terminal: Terminal, index: number) => (
    <td part={getAlternateTableCellPart(index)}>{MapTerminalStatusToBadge(terminal.status)}</td>
  ),
};
