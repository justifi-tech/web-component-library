/// <reference path="../jsx.d.ts" />
import { h } from '../utils/simple-jsx';

export interface RefundPaymentData {
  paymentId: string;
  subAccountId: string;
  webComponentToken: string;
  hideSubmitButton: boolean;
}

export function RefundPaymentComponent(data: RefundPaymentData) {
  const { paymentId, subAccountId, webComponentToken, hideSubmitButton } = data;

  return (
    <div class="two-column-layout">
      <div class="column-preview">
        <justifi-refund-payment
          payment-id={paymentId}
          account-id={subAccountId}
          auth-token={webComponentToken}
          hide-submit-button={hideSubmitButton}
        ></justifi-refund-payment>
        <button id="test-refund-button" style={hideSubmitButton ? '' : 'display: none;'}>
          Refund
        </button>
      </div>
      <div class="column-output" id="output-pane">
        <em>Refund output will appear here...</em>
      </div>
    </div>
  );
} 
