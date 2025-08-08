/// <reference path="../jsx.d.ts" />
import { h } from '../utils/simple-jsx';

export interface TerminalsListWithFiltersData {
  subAccountId: string;
  webComponentToken: string;
}

export function TerminalsListWithFiltersComponent(data: TerminalsListWithFiltersData) {
  const { subAccountId, webComponentToken } = data;

  return (
    <div class="two-column-layout">
      <div class="column-preview">
        <div class="list-component-wrapper">
          <div>
            <justifi-terminals-list-filters></justifi-terminals-list-filters>
          </div>
          <div>
            <justifi-terminals-list
              account-id={subAccountId}
              auth-token={webComponentToken}
            ></justifi-terminals-list>
          </div>
        </div>
      </div>
      <div class="column-output" id="output-pane">
        <em>Terminals list output will appear here...</em>
      </div>
    </div>
  );
} 
