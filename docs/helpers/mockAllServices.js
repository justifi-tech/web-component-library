import { createServer } from 'miragejs';
import mockBusinessDetails from '../mocks/mockBusinessDetails.json';
import mockPaymentTransactions from '../mocks/mockPaymentTransactionsSuccess.json';
import mockPaymentsList from '../mocks/mockPaymentsList.json';
import mockPaymentDetails from '../mocks/mockPaymentDetails.json';
import mockCheckoutsList from '../mocks/mockCheckoutsList.json';
import mockSubAccounts from '../mocks/mockSubAccounts.json';
import mockNPMVersion from '../mocks/mockNPMVersion.json';
import mockBusinessOwner from '../mocks/mockBusinessOwner.json';
import mockDocumentUpload from '../mocks/mockDocumentUpload.json';
import mockBusinessTerms from '../mocks/mockBusinessTerms.json';
import mockBusinessProvisioning from '../mocks/mockBusinessProvisioning.json';
import mockBankAccount from '../mocks/mockBankAccount.json';

export const API_PATHS = {
  BUSINESS_DETAILS: '/entities/business/:id',
  PAYMENT_TRANSACTIONS: '/payments/:id/payment_balance_transactions',
  PAYMENTS_LIST: '/account/:id/payments',
  PAYMENT_DETAILS: '/payments/:id',
  CHECKOUTS_LIST: 'checkouts',
  SUB_ACCOUNTS_LIST: 'sub_accounts',
  EXISTING_BUSINESS_OWNER: '/entities/identity/:id',
  NEW_BUSINESS_OWNER: '/entities/identity',
  BUSINESS_DETAILS: '/entities/business/:id',
  BUSINESS_DOCUMENT_RECORD: '/entities/document',
  BANK_ACCOUNTS: '/entities/bank_accounts',
  BUSINESS_TERMS_AND_CONDITIONS: '/entities/terms_and_conditions',
  BUSINESS_PROVISIONING: '/entities/provisioning',
  PKG_VERSION: '/@justifi/webcomponents/latest',
};

export const setUpMocks = () => {
  createServer({
    routes() {
      // Primary URL prefix for API requests
      this.urlPrefix = 'https://wc-proxy.justifi.ai';
      this.namespace = '/v1';

      // BusinessDetails
      this.get(API_PATHS.BUSINESS_DETAILS, () => mockBusinessDetails);

      // PaymentTransactions
      this.get(API_PATHS.PAYMENT_TRANSACTIONS, () => mockPaymentTransactions);
      // PaymentsList
      this.get(API_PATHS.PAYMENTS_LIST, () => mockPaymentsList);
      // PaymentDetails
      this.get(API_PATHS.PAYMENT_DETAILS, () => mockPaymentDetails);
      // CheckoutsList
      this.get(API_PATHS.CHECKOUTS_LIST, () => mockCheckoutsList);

      // SubAccountsList
      this.get(API_PATHS.SUB_ACCOUNTS_LIST, () => mockSubAccounts);
      // BusinessOwner
      this.get(API_PATHS.EXISTING_BUSINESS_OWNER, () => mockBusinessOwner);

      this.patch(API_PATHS.EXISTING_BUSINESS_OWNER, (_schema, request) => {
        const newRequestData = JSON.parse(request.requestBody);
        let mergedRequestData = {
          ...mockBusinessDetails.data.owners[0],
          ...newRequestData,
        };
        return {
          id: 2,
          type: 'identity',
          data: mergedRequestData,
          page_info: 'string',
        };
      });

      this.post(API_PATHS.NEW_BUSINESS_OWNER, () => mockBusinessOwner);

      // BusinessDetails
      this.get(API_PATHS.BUSINESS_DETAILS, () => mockBusinessDetails);

      this.patch(API_PATHS.BUSINESS_DETAILS, (_schema, request) => {
        const newRequestData = JSON.parse(request.requestBody);
        let mergedRequestData = {
          ...mockBusinessDetails.data,
          ...newRequestData,
        };
        return {
          id: 1,
          type: 'business',
          data: mergedRequestData,
          page_info: 'string',
        };
      });

      this.post(API_PATHS.BUSINESS_DOCUMENT_RECORD, () => mockDocumentUpload);

      this.post(API_PATHS.BANK_ACCOUNTS, () => mockBankAccount);

      this.post(
        API_PATHS.BUSINESS_TERMS_AND_CONDITIONS,
        () => mockBusinessTerms
      );

      this.post(
        API_PATHS.BUSINESS_PROVISIONING,
        () => mockBusinessProvisioning
      );

      // URL Prefix for NPM Package Check
      this.namespace = ''; // Reset the namespace to avoid prefixing with the primary URL prefix
      this.urlPrefix = 'https://registry.npmjs.org';

      // PackageVersion
      this.get(API_PATHS.PKG_VERSION, () => mockNPMVersion);

      // To test an error response, you can use something like:
      // this.get('/somepath', new Response(500, {}, { error: 'An error message' }));
    },
  });
};
