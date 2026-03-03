import { h } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';
import { JustifiPaymentProvisioning } from '../justifi-payment-provisioning';
import { JustifiPaymentProvisioningCore } from '../payment-provisioning-core';
import { BusinessService } from '../../../../api/services/business.service';
import { ProvisionService } from '../../../../api/services/provision.service';
import JustifiAnalytics from '../../../../api/Analytics';
import { createMockBusinessData } from './mockBusiness';

// Helper to create a valid JWT token
const createMockToken = (expInSeconds: number) => {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(JSON.stringify({ exp: expInSeconds }));
  return `${header}.${payload}.mock-signature`;
};

const validToken = createMockToken(Math.floor(Date.now() / 1000) + 3600); // 1 hour from now
const expiredToken = createMockToken(Math.floor(Date.now() / 1000) - 3600); // 1 hour ago

const mockBusinessResponse = {
  data: createMockBusinessData('US'),
};

const mockProvisionedBusinessResponse = {
  data: {
    ...createMockBusinessData('US'),
    associated_accounts: [{ id: 'acc_123' }],
  },
};

beforeEach(() => {
  // @ts-ignore
  JustifiAnalytics.prototype.trackCustomEvents = jest.fn();
  jest.clearAllMocks();
});

describe('justifi-payment-provisioning', () => {
  let consoleSpy;

  beforeEach(() => {
    consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  it('should emit error-event when authToken is missing', async () => {
    const errorEvent = jest.fn();
    await newSpecPage({
      components: [JustifiPaymentProvisioning],
      template: () => (
        <justifi-payment-provisioning
          businessId="biz_123"
          authToken=""
          onError-event={errorEvent}
        />
      ),
    });

    expect(errorEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        detail: {
          errorCode: 'missing-props',
          message: 'auth-token and business-id are required',
          severity: 'error',
        },
      })
    );
  });

  it('should emit error-event when businessId is missing', async () => {
    const errorEvent = jest.fn();
    await newSpecPage({
      components: [JustifiPaymentProvisioning],
      template: () => (
        <justifi-payment-provisioning
          businessId=""
          authToken={validToken}
          onError-event={errorEvent}
        />
      ),
    });

    expect(errorEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        detail: {
          errorCode: 'missing-props',
          message: 'auth-token and business-id are required',
          severity: 'error',
        },
      })
    );
  });

  it('should emit error-event when authToken is expired', async () => {
    const errorEvent = jest.fn();
    await newSpecPage({
      components: [JustifiPaymentProvisioning],
      template: () => (
        <justifi-payment-provisioning
          businessId="biz_123"
          authToken={expiredToken}
          onError-event={errorEvent}
        />
      ),
    });

    expect(errorEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        detail: {
          errorCode: 'not-authenticated',
          message: 'auth-token is expired',
          severity: 'error',
        },
      })
    );
  });

  it('should emit error-event when fetching business fails', async () => {
    BusinessService.prototype.fetchBusiness = jest.fn().mockRejectedValue({
      error: 'Failed to fetch business',
      code: 'fetch-error',
      severity: 'error',
    });

    const errorEvent = jest.fn();
    const page = await newSpecPage({
      components: [JustifiPaymentProvisioning, JustifiPaymentProvisioningCore],
      template: () => (
        <justifi-payment-provisioning
          businessId="biz_123"
          authToken={validToken}
          onError-event={errorEvent}
        />
      ),
    });

    await page.waitForChanges();

    expect(errorEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        detail: expect.objectContaining({
          errorCode: 'fetch-error',
          severity: 'error',
        }),
      })
    );
  });

  it('should emit info event when business is already provisioned', async () => {
    BusinessService.prototype.fetchBusiness = jest
      .fn()
      .mockResolvedValue(mockProvisionedBusinessResponse);

    const errorEvent = jest.fn();
    const page = await newSpecPage({
      components: [JustifiPaymentProvisioning, JustifiPaymentProvisioningCore],
      template: () => (
        <justifi-payment-provisioning
          businessId="biz_123"
          authToken={validToken}
          onError-event={errorEvent}
        />
      ),
    });

    await page.waitForChanges();

    expect(errorEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        detail: {
          errorCode: 'provisioning-already-requested',
          message:
            'A request to provision payments for this business has already been submitted.',
          severity: 'info',
        },
      })
    );
  });

  it('should render form after business data loads', async () => {
    BusinessService.prototype.fetchBusiness = jest
      .fn()
      .mockResolvedValue(mockBusinessResponse);

    const page = await newSpecPage({
      components: [JustifiPaymentProvisioning, JustifiPaymentProvisioningCore],
      template: () => (
        <justifi-payment-provisioning
          businessId="biz_123"
          authToken={validToken}
        />
      ),
    });

    await page.waitForChanges();

    const coreComponent = page.root.shadowRoot.querySelector(
      'justifi-payment-provisioning-core'
    );
    expect(coreComponent).not.toBeNull();
  });

  it('should emit submit-event after successful provisioning', async () => {
    const mockProvisioningResponse = { data: { id: 'prov_123' } };

    BusinessService.prototype.fetchBusiness = jest
      .fn()
      .mockResolvedValue(mockBusinessResponse);
    ProvisionService.prototype.postProvisioning = jest
      .fn()
      .mockResolvedValue(mockProvisioningResponse);

    const submitEvent = jest.fn();
    const page = await newSpecPage({
      components: [JustifiPaymentProvisioning, JustifiPaymentProvisioningCore],
      template: () => (
        <justifi-payment-provisioning
          businessId="biz_123"
          authToken={validToken}
          onSubmit-event={submitEvent}
        />
      ),
    });

    await page.waitForChanges();

    // Trigger the formCompleted event to simulate form completion
    const coreComponent = page.root.shadowRoot.querySelector(
      'justifi-payment-provisioning-core'
    );
    coreComponent.dispatchEvent(new CustomEvent('formCompleted'));

    await page.waitForChanges();

    expect(ProvisionService.prototype.postProvisioning).toHaveBeenCalled();
    expect(submitEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        detail: { response: mockProvisioningResponse },
      })
    );
  });

  it('should emit error-event when provisioning fails', async () => {
    BusinessService.prototype.fetchBusiness = jest
      .fn()
      .mockResolvedValue(mockBusinessResponse);
    ProvisionService.prototype.postProvisioning = jest
      .fn()
      .mockRejectedValue({
        error: 'Provisioning failed',
        code: 'post-error',
        severity: 'error',
      });

    const errorEvent = jest.fn();
    const submitEvent = jest.fn();
    const page = await newSpecPage({
      components: [JustifiPaymentProvisioning, JustifiPaymentProvisioningCore],
      template: () => (
        <justifi-payment-provisioning
          businessId="biz_123"
          authToken={validToken}
          onError-event={errorEvent}
          onSubmit-event={submitEvent}
        />
      ),
    });

    await page.waitForChanges();

    // Trigger the formCompleted event
    const coreComponent = page.root.shadowRoot.querySelector(
      'justifi-payment-provisioning-core'
    );
    coreComponent.dispatchEvent(new CustomEvent('formCompleted'));

    await page.waitForChanges();

    expect(errorEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        detail: expect.objectContaining({
          errorCode: 'fetch-error',
          severity: 'error',
        }),
      })
    );
  });
});
