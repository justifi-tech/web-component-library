import { registerComponentExample, createComponentExample } from './ComponentExample';
import mockGrossVolumeReportSuccess from './mockData/mockGrossVolumeReportSuccess.json';

// Register the component when module loads
if (typeof window !== 'undefined') {
  registerComponentExample();
}

// Match API endpoint pattern: /v1/account/{accountId}/reports/gross_volume
const grossVolumeEndpointPattern = /\/v1\/account\/[^/]+\/reports\/gross_volume/;

export const GrossPaymentChartExample = () => {
  return createComponentExample({
    componentName: 'Gross Payment Chart',
    componentTag: 'justifi-gross-payment-chart',
    scriptUrl: 'https://cdn.jsdelivr.net/npm/@justifi/webcomponents@latest/dist/webcomponents/webcomponents.esm.js',
    mockEndpoints: [
      {
        pattern: grossVolumeEndpointPattern.source,
        response: mockGrossVolumeReportSuccess,
      },
    ],
    componentProps: {
      'account-id': 'acc_1A2B3C4D5E6F7G8H9I0J',
      'auth-token': 'mock-token',
    },
    styles: `
      .component-example-children {
        background-color: white;
        padding: 1rem;
      }
    `,
  });
};

