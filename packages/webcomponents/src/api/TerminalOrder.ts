export interface ITerminalOrder {
  business_id: string;
  account_id: string;
  provider: string;
  order_type: string;
  order_items: ITerminalItem[];
}

export interface ITerminalItem {
  model_name: string;
  quantity: number;
}

export class TerminalOrder implements ITerminalOrder {
  public business_id: string;
  public account_id: string;
  public provider: string = 'verifone';
  public order_type: string;
  public order_items: ITerminalItem[];

  constructor(terminalOrder?: ITerminalOrder) {
    this.business_id = terminalOrder?.business_id || '';
    this.account_id = terminalOrder?.account_id || '';
    this.provider = terminalOrder?.provider || '';
    this.order_type = terminalOrder?.order_type || '';
    this.order_items = terminalOrder?.order_items || [];
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

  public updateTerminal(modelName: string, quantity: number) {
    // if quantity is 0, remove terminal
    if (quantity === 0) {
      this.order_items = this.order_items.filter(
        (t) => t.model_name !== modelName
      );
      return;
    }

    const terminal = this.order_items.find((t) => t.model_name === modelName);
    if (terminal) {
      terminal.quantity = quantity;
    } else {
      this.order_items.push({ model_name: modelName, quantity });
    }
  }
}
