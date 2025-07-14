/// <reference path="../jsx.d.ts" />
import { h } from '../utils/simple-jsx';

export interface BusinessFormData {
  webComponentToken: string;
  businessId: string;
}

export function BusinessFormComponent(data: BusinessFormData) {
  const { webComponentToken, businessId } = data;
  return (
    <div class="form-component-wrapper">
      <justifi-business-form
        auth-token={webComponentToken}
        business-id={businessId}
      />
    </div>
  );
} 
