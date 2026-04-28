import { h } from '@stencil/core';
import { Header1 } from '../../../ui-components';
import { text } from '../../../styles/parts';

export const PaymentProvisioningSubmissionFailed = () => {
  return (
    <div class="row gap-3 p-5">
      <div class="col-12">
        <Header1 text="Something went wrong" />
      </div>
      <div class="col-12" part={text}>
        <p>There was an error submitting the provisioning. Your progress has been saved — please try again later or contact the support team.</p>
      </div>
    </div>
  );
};
