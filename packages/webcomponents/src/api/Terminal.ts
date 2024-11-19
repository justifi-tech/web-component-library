import { capitalizeFirstLetter } from '../utils/utils';

export interface TerminalsTableFilterParams {
  terminal_id?: string;
  status?: string;
  account_id?: string;
  before_cursor?: string;
  after_cursor?: string;
}

export interface ITerminalStatus {
  id?: string | null;
  status: string
  last_date_time_connected?: string | null;
  last_date_time_active?: string | null;
}

export interface ITerminal {
  id?: string | null;
  status?: string | null;
  account_id?: string | null;
  platform_account_id?: string | null;
  gateway_ref_id?: string | null;
  provider?: string | null;
  provider_id?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  verified_at?: string | null;
  nickname?: string | null;
}

export enum TerminalStatuses {
  connected = 'connected',
  disconnected = 'disconnected',
  unknown = 'unknown',
}

export class Terminal implements ITerminal {
  public id: string;
  public status: TerminalStatuses;
  public account_id: string;
  public platform_account_id: string;
  public provider: string;
  public provider_id: string;
  public created_at: string;
  public updated_at: string;
  public verified_at: string;
  public nickname: string;
  public sub_account_name: string;

  constructor(data: ITerminal) {
    this.id = data.id || '';
    this.status = data.status as TerminalStatuses;
    this.account_id = data.account_id || '';
    this.platform_account_id = data.platform_account_id || '';
    this.provider = data.provider || '';
    this.provider_id = data.provider_id || '';
    this.created_at = data.created_at || '';
    this.updated_at = data.updated_at || '';
    this.verified_at = data.verified_at || '';
    this.nickname = data.nickname || '';
  }

  get providerDisplayName(): string {
    return capitalizeFirstLetter(this.provider);
  }
};
