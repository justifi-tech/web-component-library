import { TerminalProviders } from './Terminal';
import { TerminalModelName } from './TerminalModel';

export interface TerminalOrderQueryParams {
  order_status?: TerminalOrderStatus;
  order_type?: TerminalOrderType;
  created_after?: string;
  created_before?: string;
}

export enum TerminalOrderType {
  boardingOnly = 'boarding_only',
  boardingShipping = 'boarding_shipping',
}

export enum TerminalOrderStatus {
  created = 'created',
  submitted = 'submitted',
  completed = 'completed',
  in_progress = 'in_progress',
  on_hold = 'on_hold',
  canceled = 'canceled',
}

export interface OrderedTerminal {
  terminal_id: string;
  terminal_did: string;
  model_name: TerminalModelName;
}

export interface TerminalOrderItem {
  model_name: TerminalModelName;
  quantity: number;
}

export interface ITerminalOrder {
  id?: string;
  business_id?: string;
  company_name?: string;
  sub_account_id?: string;
  provider?: TerminalProviders;
  order_type?: TerminalOrderType;
  order_status?: TerminalOrderStatus;
  terminals?: OrderedTerminal[];
  created_at?: string;
  updated_at?: string;
}
