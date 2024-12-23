import { Fragment, h } from "@stencil/core";
import { Skeleton } from "../../ui-components";

export const BusinessDetailsLoading = () => {
  const Block = () => (
    <div class="mt-5">
      <Skeleton width="40%" height="1.5rem" />
      <hr />

      <div class="row g-3">
        <div class="col-12 col-md-6">
          <Skeleton />
          <Skeleton />
          <Skeleton />
        </div>
        <div class="col-12 col-md-6">
          <Skeleton />
          <Skeleton />
          <Skeleton />
        </div>
      </div>
    </div>
  );

  return (
    <Fragment>
      <Block />
      <Block />
      <Block />
      <Block />
    </Fragment>
  );
}
