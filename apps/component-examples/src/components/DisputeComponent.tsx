/// <reference path="../jsx.d.ts" />
import { h } from '../utils/simple-jsx';

export interface DisputeData {
  disputeId: string;
  webComponentToken: string;
}

export function DisputeComponent(data: DisputeData) {
  const { disputeId, webComponentToken } = data;

  return (
    <div class="two-column-layout">
      <div class="column-preview">
        <div style="margin:0 auto;max-width:700px;">
          <justifi-dispute-management
            dispute-id={disputeId}
            auth-token={webComponentToken}
          ></justifi-dispute-management>
        </div>
      </div>
      <div class="column-output" id="output-pane">
        <em>Dispute management output will appear here...</em>
      </div>
    </div>
  );
} 
