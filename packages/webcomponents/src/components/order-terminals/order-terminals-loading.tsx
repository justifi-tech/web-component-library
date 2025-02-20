import { h } from '@stencil/core';
import { Skeleton } from '../../ui-components';

const FormBlock = () => (
  <div class="row gap-3">
    <div class="col-12">
      <Skeleton width="25%" />
    </div>
    <div class="col-12">
      <Skeleton width="100%" />
    </div>
    <div class="col-12 d-flex gap-3">
      <Skeleton width="50%" />
      <Skeleton width="50%" />
    </div>
    <div class="col-12 d-flex gap-3">
      <Skeleton width="65%" />
      <Skeleton width="35%" />
    </div>
  </div>
);

export const OrderTerminalsLoading = () => {
  return (
    <div class="row gap-5">
      <div class="col-12">
        <Skeleton width="40%" height="40px" />
      </div>
      <FormBlock />
      <FormBlock />
      <FormBlock />
    </div>
  );
}
