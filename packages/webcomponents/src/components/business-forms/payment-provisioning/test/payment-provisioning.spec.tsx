import { newSpecPage } from '@stencil/core/testing';
import { PaymentProvisioning } from '../payment-provisioning';
import JustifiAnalytics from '../../../../api/Analytics';

beforeEach(() => {
  // Bypass Analytics to avoid errors. Analytics attaches events listeners to HTML elements
  // which are not available in Jest/node environment
  // @ts-ignore
  JustifiAnalytics.prototype.trackCustomEvents = jest.fn();
});

describe.skip('justifi-payment-provisioning', () => {
  let consoleSpy;

  // Initialize the spy in the beforeEach
  beforeEach(() => {
    consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => { });
  });

  // Restore the original function in the afterEach
  afterEach(() => {
    consoleSpy.mockRestore();
  });

  it('should log a warning if no authToken is provided', async () => {
    await newSpecPage({
      components: [PaymentProvisioning],
      html: `<justifi-payment-provisioning></justifi-payment-provisioning>`,
    });

  });

  it('should log a warning if no businessId is provided', async () => {
    await newSpecPage({
      components: [PaymentProvisioning],
      html: `<justifi-payment-provisioning></justifi-payment-provisioning>`,
    });

  });

  it('should emit server error event if server error when fetching data', async () => {
    await newSpecPage({
      components: [PaymentProvisioning],
      html: `<justifi-payment-provisioning business-id="biz_123" auth-token="some-token"></justifi-payment-provisioning>`,
    });

  });

  it('should emit server error event if server error when patching data', async () => {
    await newSpecPage({
      components: [PaymentProvisioning],
      html: `<justifi-payment-provisioning business-id="biz_123" auth-token="some-token"></justifi-payment-provisioning>`,
    });

  });


  it('should render', async () => {
    await newSpecPage({
      components: [PaymentProvisioning],
      html: `<justifi-payment-provisioning business-id="biz_123" auth-token="some-token"></justifi-payment-provisioning>`,
    });

  });

  it('should call onSuccess when a step is successfully completed', async () => {
    await newSpecPage({
      components: [PaymentProvisioning],
      html: `<justifi-payment-provisioning business-id="biz_123" auth-token="some-token"></justifi-payment-provisioning>`,
    });

  });

  it('should emit clickEvent when a button is clicked', async () => {
    await newSpecPage({
      components: [PaymentProvisioning],
      html: `<justifi-payment-provisioning business-id="biz_123" auth-token="some-token"></justifi-payment-provisioning>`,
    });

  });

  it('should emit submitted event when a step is completed', async () => {
    await newSpecPage({
      components: [PaymentProvisioning],
      html: `<justifi-payment-provisioning business-id="biz_123" auth-token="some-token"></justifi-payment-provisioning>`,
    });

  });
});
