/// <reference path="../jsx.d.ts" />
import { h } from '../utils/simple-jsx';

export interface BusinessDetailsData {
  webComponentToken: string;
  businessId: string;
}

export function BusinessDetailsComponent(data: BusinessDetailsData) {
  const { webComponentToken, businessId } = data;
  return (
    <div class="list-component-wrapper">
      <justifi-business-details
        auth-token={webComponentToken}
        business-id={businessId}
      />
    </div>
  );
} 
