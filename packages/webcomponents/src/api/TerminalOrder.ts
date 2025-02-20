import { TerminalProviders } from './Terminal';
import { TerminalModelName } from './TerminalModel';

enum TerminalOrderType {
  boardingOnly = 'boarding_only',
  boardingShipping = 'boarding_shipping'
}

enum TerminalOrderStatus {
  submitted = 'submitted',
  completed = 'completed'
}

// This is the interface for the terminal item returned from the API response
interface OrderedTerminal {
  terminal_id: string,
  terminal_did: string,
  model_name: TerminalModelName;
}

// This is the interface for the terminal item generated by the order form component
interface TerminalOrderItem {
  model_name: TerminalModelName;
  quantity: number;
}

export interface ITerminalOrder {
  id?: string;
  business_id?: string;
  account_id?: string;
  provider?: TerminalProviders;
  order_type?: TerminalOrderType;
  order_status?: TerminalOrderStatus;
  terminals?: OrderedTerminal[];
  created_at?: string;
  updated_at?: string;
}

export class TerminalOrder {
  public id: string;
  public business_id: string;
  public account_id: string;
  public provider: TerminalProviders;
  public order_type: TerminalOrderType;
  public order_status: TerminalOrderStatus;
  public terminals: OrderedTerminal[];
  public order_items: TerminalOrderItem[];
  public created_at: string;
  public updated_at: string;

  constructor(data: ITerminalOrder) {
    this.id = data.id;
    this.business_id = data.business_id;
    this.account_id = data.account_id;
    this.provider = data.provider || TerminalProviders.verifone;
    this.order_type = data.order_type;
    this.order_status = data.order_status;
    this.terminals = data.terminals;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }

  public get payload() {
    return {
      business_id: this.business_id,
      account_id: this.account_id,
      provider: this.provider,
      order_type: this.order_type,
      order_items: this.order_items,
    };
  }

  public get totalQuantity() {
    return this.order_items.reduce((acc, item) => acc + item.quantity, 0);
  }

  public updateTerminal(model_name: TerminalModelName, quantity: number) {
    // if quantity is 0, remove terminal
    if (quantity === 0) {
      this.order_items = this.order_items.filter(
        (t) => t.model_name !== model_name
      );
      return;
    }

    const terminal = this.order_items.find((t) => t.model_name === model_name);
    if (terminal) {
      terminal.quantity = quantity;
    } else {
      this.order_items.push({ model_name, quantity });
    }
  }
}
