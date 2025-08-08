/// <reference path="../jsx.d.ts" />
import { h } from '../utils/simple-jsx';

export interface TerminalOrdersListData {
  subAccountId: string;
  webComponentToken: string;
}

export function TerminalOrdersListComponent(data: TerminalOrdersListData) {
  const { subAccountId, webComponentToken } = data;

  return (
    <div class="two-column-layout">
      <div class="column-preview">
        <div class="list-component-wrapper">
          <justifi-terminal-orders-list
            account-id={subAccountId}
            auth-token={webComponentToken}
          ></justifi-terminal-orders-list>
        </div>
      </div>
      <div class="column-output" id="output-pane">
        <em>Terminal orders list output will appear here...</em>
      </div>
    </div>
  );
} 
