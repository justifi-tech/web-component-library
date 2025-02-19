export interface ITerminalOrder {
  businessId: string;
  accountId: string;
  provider: string;
  orderType: string;
  orderItems: iTerminalItem[];
}

export interface iTerminalItem {
  modelName: string;
  quantity: number;
}

export class TerminalOrder implements ITerminalOrder {
  public businessId: string;
  public accountId: string;
  public provider: string = 'verifone';
  public orderType: string;
  public orderItems: iTerminalItem[];

  constructor(terminalOrder?: ITerminalOrder) {
    this.businessId = terminalOrder?.businessId || '';
    this.accountId = terminalOrder?.accountId || '';
    this.provider = terminalOrder?.provider || '';
    this.orderType = terminalOrder?.orderType || '';
    this.orderItems = terminalOrder?.orderItems || [];
  }

  public get payload() {
    return {
      business_id: this.businessId,
      account_id: this.accountId,
      provider: this.provider,
      order_type: this.orderType,
      order_items: this.orderItems,
    };
  }

  public get totalQuantity() {
    return this.orderItems.reduce((acc, item) => acc + item.quantity, 0);
  }

  public addTerminal(terminalId: string, quantity: number) {
    const terminal = this.orderItems.find((t) => t.modelName === terminalId);
    if (terminal) {
      terminal.quantity += quantity;
    } else {
      this.orderItems.push({ modelName: terminalId, quantity });
    }
  }

  public updateTerminal(terminalId: string, quantity: number) {
    // if quantity is 0, remove terminal
    if (quantity === 0) {
      this.orderItems = this.orderItems.filter(
        (t) => t.modelName !== terminalId
      );
      return;
    }

    const terminal = this.orderItems.find((t) => t.modelName === terminalId);
    if (terminal) {
      terminal.quantity = quantity;
    } else {
      this.orderItems.push({ modelName: terminalId, quantity });
    }
  }
}
