import { h } from '@stencil/core';
import { Skeleton, StyledHost } from '../../ui-components';

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
