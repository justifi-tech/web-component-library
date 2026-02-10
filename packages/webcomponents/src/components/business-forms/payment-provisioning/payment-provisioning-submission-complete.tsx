import { h } from '@stencil/core';
import { Header1 } from '../../../ui-components';
import { text } from '../../../styles/parts';

export const PaymentProvisioningSubmissionComplete = () => {
  return (
    <div class="row gap-3 p5">
      <div class="col-12">
        <Header1 text="You're all set for now" />
      </div>
      <div class="col-12" part={text}>
        <p>We're reviewing your information and working on your approval. We'll be in touch to let
        you know once you've been approved (or if we find anything that needs fixing). Have a good one!</p>
      </div>
    </div>
  );
};
