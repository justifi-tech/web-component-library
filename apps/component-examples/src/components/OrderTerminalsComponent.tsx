/// <reference path="../jsx.d.ts" />
import { h } from '../utils/simple-jsx';

export interface OrderTerminalsData {
  accountId: string;
  businessId: string;
  webComponentToken: string;
  shipping: boolean;
}

export function OrderTerminalsComponent(data: OrderTerminalsData) {
  const { accountId, businessId, webComponentToken, shipping } = data;

  return (
    <div class="two-column-layout">
      <div class="column-preview">
        <div id="component-wrapper" style="margin:0 auto;max-width:700px;">
          <justifi-order-terminals
            account-id={accountId}
            auth-token={webComponentToken}
            business-id={businessId}
            shipping={shipping}
          ></justifi-order-terminals>
        </div>
      </div>
      <div class="column-output" id="output-pane">
        <em>Order terminals output will appear here...</em>
      </div>
    </div>
  );
} 
