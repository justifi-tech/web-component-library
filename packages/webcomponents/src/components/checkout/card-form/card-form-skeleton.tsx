import { h } from "@stencil/core";
import { Skeleton } from "../../../ui-components/skeleton";

const cardFormSkeleton = () => {
  return (
    <div class="container-fluid p-0">
      <div class="mb-3">
        <Skeleton height="18px" width="100px" />
        <Skeleton height="36px" />
      </div>
      <div class="row">
        <div class="col-4 align-content-end">
          <Skeleton height="18px" width="80px" />
          <Skeleton height="36px" />
        </div>
        <div class="col-4 align-content-end">
          <Skeleton height="36px" />
        </div>
        <div class="col-4 align-content-end">
          <Skeleton height="18px" width="30px" />
          <Skeleton height="36px" />
        </div>
      </div>
    </div>
  );
};

export default cardFormSkeleton;