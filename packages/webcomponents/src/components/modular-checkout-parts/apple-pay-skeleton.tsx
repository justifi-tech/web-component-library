import { FunctionalComponent, h } from "@stencil/core";
import { Skeleton } from "../../ui-components";

interface ApplePaySkeletonProps {
  isReady: boolean;
}

const ApplePaySkeleton: FunctionalComponent<ApplePaySkeletonProps> = (
  props
) => {
  const { isReady } = props;

  if (isReady) {
    return null;
  }

  return (
    <div class='container-fluid p-0'>
      <div class='row mb-3'>
        <div class='col-12 align-content-center'>
          <Skeleton
            height='44px'
            width='100%'
            styles={{ borderRadius: "8px" }}
          />
        </div>
      </div>
    </div>
  );
};

export default ApplePaySkeleton;
