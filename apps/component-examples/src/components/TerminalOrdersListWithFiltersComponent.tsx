/// <reference path="../jsx.d.ts" />
import { h } from '../utils/simple-jsx';

export interface TerminalOrdersListWithFiltersData {
  subAccountId: string;
  webComponentToken: string;
}

export function TerminalOrdersListWithFiltersComponent(data: TerminalOrdersListWithFiltersData) {
  const { subAccountId, webComponentToken } = data;

  return (
    <div class="two-column-layout">
      <div class="column-preview">
        <div class="list-component-wrapper">
          <div>
            <justifi-terminal-orders-list-filters></justifi-terminal-orders-list-filters>
          </div>
          <div>
            <justifi-terminal-orders-list
              account-id={subAccountId}
              auth-token={webComponentToken}
            ></justifi-terminal-orders-list>
          </div>
        </div>
      </div>
      <div class="column-output" id="output-pane">
        <em>Terminal orders list output will appear here...</em>
      </div>
    </div>
  );
} 
