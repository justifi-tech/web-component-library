import { createServer } from 'miragejs';
import mockBusinessDetails from '../../../../mockData/mockBusinessDetails.json';
import mockGrossPaymentChart from '../../../../mockData/mockGrossVolumeReportSuccess.json';
import mockPayment from '../../../../mockData/mockPaymentDetailSuccess.json';
import mockPayments from '../../../../mockData/mockPaymentsSuccess.json';
import mockPayout from '../../../../mockData/mockPayoutDetailsSuccess.json';
import mockPayouts from '../../../../mockData/mockPayoutsSuccess.json';

export const mockAllServices = () => {
  createServer({
    routes() {
      this.urlPrefix = 'https://wc-proxy.justifi.ai/v1';

      // BusinessDetails
      this.get('/entities/business/:id', () => mockBusinessDetails);

      this.patch('/entities/business/:id', (schema, request) => {
        const id = request.params.id;
        const newDetails = JSON.parse(request.requestBody);
        return { ...mockBusinessDetails, ...newDetails, id };
      });

      // GrossPaymentChart
      this.get(
        '/account/:accountId/reports/gross_volume',
        () => mockGrossPaymentChart
      );

      // PaymentDetails
      this.get('payments/:id', () => mockPayment);

      // PaymentsList
      this.get('account/:id/payments', () => mockPayments);

      // PayoutDetails
      this.get('payouts/:id', () => mockPayout);

      // PayoutsList
      this.get('account/:id/payouts', () => mockPayouts);

      // To test an error response, you can use something like:
      // this.get('/somepath', new Response(500, {}, { error: 'An error message' }));
    },
  });
};
