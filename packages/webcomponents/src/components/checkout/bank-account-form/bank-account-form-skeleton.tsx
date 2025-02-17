import { h } from "@stencil/core";
import { Skeleton } from "../../../ui-components/skeleton";

const bankAccountFormSkeleton = () => {
  return (
    <div class="container-fluid p-0">
      <div class="row mb-3">
        <div class="col-12 align-content-end">
          <Skeleton height="18px" width="120px" />
          <Skeleton height="36px" />
        </div>
      </div>
      <div class="row">
        <div class="col-12 align-content-end">
          <Skeleton height="18px" width="110px" />
          <Skeleton height="36px" />
        </div>
      </div>
    </div>
  );
};

export default bankAccountFormSkeleton;