import paymentDetail from '../../mockData/mockPaymentDetailSuccess.json';
import payments from '../../mockData/mockPaymentsSuccess.json';

// MOCK PAYMENT SERVICE
export class PaymentService {
  fetchPayment = async (_id: string, _authToken: string) => {
    return paymentDetail;
  };

  fetchPayments = async (_id: string, _authToken: string, _params: any) => {
    return payments;
  };
}
