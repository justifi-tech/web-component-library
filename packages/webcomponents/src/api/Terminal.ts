import { TerminalModelName } from "./TerminalModel";

export interface TerminalsQueryParams {
  terminal_id?: string;
  status?: string;
}

export enum ITerminalStatus {
  connected = 'connected',
  disconnected = 'disconnected',
  unknown = 'unknown',
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

export class Terminal implements ITerminal {
  public id: string;
  public status: ITerminalStatus;
  public account_id: string;
  public platform_account_id: string;
  public provider: TerminalProviders;
  public provider_id: string;
  public provider_serial_number: string;
  public created_at: string;
  public updated_at: string;
  public verified_at: string;
  public nickname: string;
  public sub_account_name: string;
  public model_name: TerminalModelName;

  constructor(data: ITerminal) {
    this.id = data.id || '';
    this.status = data.status;
    this.account_id = data.account_id || '';
    this.platform_account_id = data.platform_account_id || '';
    this.provider = data.provider || null;
    this.provider_id = data.provider_id || '';
    this.provider_serial_number = data.provider_serial_number || '';
    this.created_at = data.created_at || '';
    this.updated_at = data.updated_at || '';
    this.verified_at = data.verified_at || '';
    this.nickname = data.nickname || '';
    this.model_name = data.model_name || null;
  }
};
