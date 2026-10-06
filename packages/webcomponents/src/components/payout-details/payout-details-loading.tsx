import { h } from "@stencil/core";
import { Skeleton } from "../../ui-components";

const PayoutDetailsLoading = () => (
  <div class="row gap-3">
    <div class="col-12"><Skeleton width="35%" height="30px" /></div>
    <div class="col-12"><Skeleton width="70%" /></div>
    <div class="col-12"><Skeleton width="40%" /></div>
    <div class="col-12"><Skeleton width="40%" /></div>
    <div class="col-12"><Skeleton width="100%" /></div>
    <div class="col-12"><Skeleton width="80%" /></div>
  </div>
)

export default PayoutDetailsLoading;
