import { h } from '@stencil/core';
import { Header1 } from '../../../ui-components';
import { text } from '../../../styles/parts';

export const PaymentProvisioningSubmissionComplete = () => {
  return (
    <div class="row gap-3">
      <div class="col-12">
        <Header1 text="You're all set for now" />
      </div>
      <div class="col-12" part={text}>
        <p>We have already received the onboarding information for this business.</p>
      </div>
    </div>
  );
};
