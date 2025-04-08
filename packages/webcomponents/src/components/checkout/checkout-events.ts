import { ICheckoutCompleteResponse } from "../../api/Checkout";

export type CheckoutSubmitEvent = {
  response: ICheckoutCompleteResponse;
}