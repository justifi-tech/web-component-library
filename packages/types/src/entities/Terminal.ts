import { TerminalModelName } from './TerminalModel';

export interface TerminalsQueryParams {
  terminal_id?: string;
  terminal_order_id?: string;
  status?: string;
  created_after?: string;
  created_before?: string;
}

export enum ITerminalStatus {
  connected = 'connected',
  disconnected = 'disconnected',
  unknown = 'unknown',
  pending_configuration = 'pending_configuration',
  archived = 'archived',
}

export interface ITerminal {
  id?: string | null;
  status?: ITerminalStatus;
  account_id?: string | null;
  platform_account_id?: string | null;
  gateway_ref_id?: string | null;
  provider?: TerminalProviders | null;
  provider_id?: string | null;
  provider_serial_number?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  verified_at?: string | null;
  nickname?: string | null;
  model_name?: TerminalModelName | null;
}

export enum TerminalProviders {
  verifone = 'verifone',
}
