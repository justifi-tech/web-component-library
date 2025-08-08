/// <reference path="../jsx.d.ts" />
import { h } from '../utils/simple-jsx';

export interface TerminalsListData {
  subAccountId: string;
  webComponentToken: string;
}

export function TerminalsListComponent(data: TerminalsListData) {
  const { subAccountId, webComponentToken } = data;

  return (
    <div class="two-column-layout">
      <div class="column-preview">
        <div class="list-component-wrapper">
          <justifi-terminals-list
            account-id={subAccountId}
            auth-token={webComponentToken}
          ></justifi-terminals-list>
        </div>
      </div>
      <div class="column-output" id="output-pane">
        <em>Terminals list output will appear here...</em>
      </div>
    </div>
  );
} 
