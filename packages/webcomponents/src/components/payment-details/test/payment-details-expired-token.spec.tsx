// Had to create this extra file to mock the service with an error, 
// otherwise it would not work

jest.mock('../../../api/services/payment.service', () => {
  return {
    PaymentService: jest.fn().mockImplementation(() => {
      return {
        fetchPayment: jest.fn().mockResolvedValue({
          "error": {
            "code": "not_authenticated",
            "message": "Not Authenticated"
          }
        })
      };
    })
  };
});

import { newSpecPage } from "@stencil/core/testing";
import { PaymentDetails } from "../payment-details";
import { PaymentDetailsCore } from "../payment-details-core";
import { Details } from "../../details/details";

describe('payment-details expiredToken event', () => {
  it('emits tokenExpired event when token is expired', async () => {
    const eventSpy = jest.fn();

    const page = await newSpecPage({
      components: [PaymentDetails, PaymentDetailsCore, Details],
      html: (`<justifi-payment-details payment-id="abc" auth-token="abc" />`),
    });

    page.root.addEventListener('tokenExpired', eventSpy);

    page.rootInstance.handleError({ detail: 'Not Authenticated' });

    expect(eventSpy).toHaveBeenCalled();
  });
});
