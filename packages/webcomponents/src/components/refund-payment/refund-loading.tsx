import { h } from '@stencil/core';
import { Skeleton } from '@ui-components/skeleton';
import { StyledHost } from '@ui-components/styled-host/styled-host';

const FormBlock = () => (
  <div class="row gap-3">
    <div class="col-12">
      <Skeleton width="100%" height="40px" />
    </div>
  </div>
);

export const RefundLoading = () => {
  return (
     <StyledHost>
      <div class="row gap-5">
        <FormBlock />
        <FormBlock />
        <FormBlock />
      </div>
     </StyledHost>
  );
}
