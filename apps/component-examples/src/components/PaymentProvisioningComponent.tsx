/// <reference path="../jsx.d.ts" />
import { h } from '../utils/simple-jsx';

export interface PaymentProvisioningData {
  businessId: string;
  webComponentToken: string;
}

export function PaymentProvisioningComponent(data: PaymentProvisioningData) {
  const { businessId, webComponentToken } = data;

  return (
    <div class="two-column-layout">
      <div class="column-preview">
        <div style="margin:0 auto;max-width:700px;">
          <justifi-payment-provisioning
            business-id={businessId}
            auth-token={webComponentToken}
          ></justifi-payment-provisioning>
        </div>
      </div>
      <div class="column-output" id="output-pane">
        <em>Payment provisioning output will appear here...</em>
      </div>
    </div>
  );
} 
