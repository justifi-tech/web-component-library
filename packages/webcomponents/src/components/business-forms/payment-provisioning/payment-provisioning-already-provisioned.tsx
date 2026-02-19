import { h } from '@stencil/core';
import { Header1 } from '@ui-components/headers/header-1';
import { text } from '../../../styles/parts';

export const PaymentProvisioningAlreadyProvisioned = () => {
  return (
    <div class="row gap-3 p-5">
      <div class="col-12">
        <Header1 text="Business Already Provisioned" />
      </div>
      <div class="col-12" part={text}>
        <p>We have already received the onboarding information for this business.</p>
      </div>
    </div>
  );
};
