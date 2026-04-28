import { h } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';
import { JustifiPaymentProvisioning } from '../justifi-payment-provisioning';
import { BusinessService } from '../../../../api/services/business.service';
import { ProvisionService } from '../../../../api/services/provision.service';
import JustifiAnalytics from '../../../../api/Analytics';
import { createMockBusinessData } from './mockBusiness';
import { BusinessFormClickActions } from '../../utils/event-types';

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
      components: [JustifiPaymentProvisioning],
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
      components: [JustifiPaymentProvisioning],
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

    const hostText = page.root.shadowRoot?.textContent ?? '';
    expect(hostText).toContain('Business Already Provisioned');
    expect(hostText).toContain(
      'We have already received the onboarding information for this business.',
    );
  });

  it('should render form after business data loads', async () => {
    BusinessService.prototype.fetchBusiness = jest
      .fn()
      .mockResolvedValue(mockBusinessResponse);

    const page = await newSpecPage({
      components: [JustifiPaymentProvisioning],
      template: () => (
        <justifi-payment-provisioning
          businessId="biz_123"
          authToken={validToken}
        />
      ),
    });

    await page.waitForChanges();

    const formSteps = page.root.shadowRoot.querySelector(
      'payment-provisioning-form-steps'
    );
    expect(formSteps).not.toBeNull();
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
      components: [JustifiPaymentProvisioning],
      template: () => (
        <justifi-payment-provisioning
          businessId="biz_123"
          authToken={validToken}
          onSubmit-event={submitEvent}
        />
      ),
    });

    await page.waitForChanges();

    page.root.dispatchEvent(new CustomEvent('formCompleted'));

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
      components: [JustifiPaymentProvisioning],
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

    page.root.dispatchEvent(new CustomEvent('formCompleted'));

    await page.waitForChanges();

    expect(errorEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        detail: expect.objectContaining({
          errorCode: 'fetch-error',
          severity: 'error',
        }),
      })
    );

    expect(page.rootInstance.submissionFailed).toBe(true);
    await page.waitForChanges();
    const hostText = page.root.shadowRoot?.textContent ?? '';
    expect(hostText).toContain('Something went wrong');
    expect(hostText).toContain('try again later');
  });

  it('should not mark form submitted when provisioning resolves without data', async () => {
    BusinessService.prototype.fetchBusiness = jest
      .fn()
      .mockResolvedValue(mockBusinessResponse);
    ProvisionService.prototype.postProvisioning = jest
      .fn()
      .mockResolvedValue({ errors: ['boom'] });

    const errorEvent = jest.fn();
    const submitEvent = jest.fn();
    const page = await newSpecPage({
      components: [JustifiPaymentProvisioning],
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

    page.root.dispatchEvent(new CustomEvent('formCompleted'));

    await page.waitForChanges();

    expect(page.rootInstance.formSubmitted).toBe(false);
    expect(page.root.shadowRoot?.textContent).not.toContain(
      "You're all set for now"
    );
    expect(errorEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        detail: expect.objectContaining({ severity: 'error' }),
      })
    );
    expect(submitEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        detail: { response: { error: 'boom' } },
      })
    );
  });

  describe('step orchestration', () => {
    beforeEach(() => {
      BusinessService.prototype.fetchBusiness = jest
        .fn()
        .mockResolvedValue(mockBusinessResponse);
    });

    it('should display step counter "Step 1 of 7" on initial load', async () => {
      const page = await newSpecPage({
        components: [JustifiPaymentProvisioning],
        template: () => (
          <justifi-payment-provisioning
            businessId="biz_123"
            authToken={validToken}
          />
        ),
      });

      await page.waitForChanges();

      expect(page.root.shadowRoot?.textContent).toContain('Step 1 of 8');
    });

    it.each([
      ['Step 1 of 8', 0],
      ['Step 4 of 8', 3],
      ['Step 7 of 8', 6],
      ['Step 8 of 8', 7],
    ])(
      'should display step counter "%s" when currentStep is %i',
      async (expectedText, currentStep) => {
        const page = await newSpecPage({
          components: [JustifiPaymentProvisioning],
          template: () => (
            <justifi-payment-provisioning
              businessId="biz_123"
              authToken={validToken}
            />
          ),
        });

        await page.waitForChanges();

        page.rootInstance.currentStep = currentStep;
        await page.waitForChanges();

        expect(page.root.shadowRoot?.textContent).toContain(expectedText);
      }
    );

    it('should increment step from 0 to 1', async () => {
      const page = await newSpecPage({
        components: [JustifiPaymentProvisioning],
        template: () => (
          <justifi-payment-provisioning
            businessId="biz_123"
            authToken={validToken}
          />
        ),
      });

      await page.waitForChanges();

      page.rootInstance.incrementSteps();
      await page.waitForChanges();

      expect(page.rootInstance.currentStep).toBe(1);
    });

    it('should not increment past step 7', async () => {
      const page = await newSpecPage({
        components: [JustifiPaymentProvisioning],
        template: () => (
          <justifi-payment-provisioning
            businessId="biz_123"
            authToken={validToken}
          />
        ),
      });

      await page.waitForChanges();

      page.rootInstance.currentStep = 7;
      page.rootInstance.incrementSteps();
      await page.waitForChanges();

      expect(page.rootInstance.currentStep).toBe(7);
    });

    it('should decrement step from 1 to 0', async () => {
      const page = await newSpecPage({
        components: [JustifiPaymentProvisioning],
        template: () => (
          <justifi-payment-provisioning
            businessId="biz_123"
            authToken={validToken}
          />
        ),
      });

      await page.waitForChanges();

      page.rootInstance.currentStep = 1;
      page.rootInstance.decrementSteps();
      await page.waitForChanges();

      expect(page.rootInstance.currentStep).toBe(0);
    });

    it('should not decrement below step 0', async () => {
      const page = await newSpecPage({
        components: [JustifiPaymentProvisioning],
        template: () => (
          <justifi-payment-provisioning
            businessId="biz_123"
            authToken={validToken}
          />
        ),
      });

      await page.waitForChanges();

      page.rootInstance.currentStep = 0;
      page.rootInstance.decrementSteps();
      await page.waitForChanges();

      expect(page.rootInstance.currentStep).toBe(0);
    });

    it('should call validateAndSubmit on current step ref when nextStepButtonOnClick', async () => {
      const page = await newSpecPage({
        components: [JustifiPaymentProvisioning],
        template: () => (
          <justifi-payment-provisioning
            businessId="biz_123"
            authToken={validToken}
          />
        ),
      });

      await page.waitForChanges();

      const mockValidateAndSubmit = jest.fn();
      page.rootInstance.refs[0] = {
        validateAndSubmit: mockValidateAndSubmit,
      };

      page.rootInstance.nextStepButtonOnClick(
        { preventDefault: jest.fn() },
        BusinessFormClickActions.nextStep
      );

      expect(mockValidateAndSubmit).toHaveBeenCalledWith({
        onSuccess: page.rootInstance.incrementSteps,
      });
    });

    it('should not advance step when validateAndSubmit does not call onSuccess', async () => {
      const page = await newSpecPage({
        components: [JustifiPaymentProvisioning],
        template: () => (
          <justifi-payment-provisioning
            businessId="biz_123"
            authToken={validToken}
          />
        ),
      });

      await page.waitForChanges();

      page.rootInstance.refs[0] = {
        validateAndSubmit: (_opts: { onSuccess: () => void }) => {
          /* intentionally not calling onSuccess - simulates validation failure */
        },
      };

      page.rootInstance.nextStepButtonOnClick(
        { preventDefault: jest.fn() },
        BusinessFormClickActions.nextStep
      );
      await page.waitForChanges();

      expect(page.rootInstance.currentStep).toBe(0);
    });

    it('should emit click-event with previousStep and decrement on previousStepButtonOnClick', async () => {
      const clickEvent = jest.fn();
      const page = await newSpecPage({
        components: [JustifiPaymentProvisioning],
        template: () => (
          <justifi-payment-provisioning
            businessId="biz_123"
            authToken={validToken}
            onClick-event={clickEvent}
          />
        ),
      });

      await page.waitForChanges();

      page.rootInstance.currentStep = 2;
      page.rootInstance.previousStepButtonOnClick();
      await page.waitForChanges();

      expect(clickEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          detail: { name: BusinessFormClickActions.previousStep },
        })
      );
      expect(page.rootInstance.currentStep).toBe(1);
    });

    it('should update loading state when formLoading event fires', async () => {
      const page = await newSpecPage({
        components: [JustifiPaymentProvisioning],
        template: () => (
          <justifi-payment-provisioning
            businessId="biz_123"
            authToken={validToken}
          />
        ),
      });

      await page.waitForChanges();

      page.root.dispatchEvent(
        new CustomEvent('formLoading', { detail: true, bubbles: false })
      );
      await page.waitForChanges();

      expect(page.rootInstance.loading).toBe(true);

      page.root.dispatchEvent(
        new CustomEvent('formLoading', { detail: false, bubbles: false })
      );
      await page.waitForChanges();

      expect(page.rootInstance.loading).toBe(false);
    });

    it('should set formDisabled when formLoading is true', async () => {
      const page = await newSpecPage({
        components: [JustifiPaymentProvisioning],
        template: () => (
          <justifi-payment-provisioning
            businessId="biz_123"
            authToken={validToken}
          />
        ),
      });

      await page.waitForChanges();

      page.root.dispatchEvent(
        new CustomEvent('formLoading', { detail: true, bubbles: false })
      );
      await page.waitForChanges();

      expect(page.rootInstance.loading).toBe(true);
      expect(page.rootInstance.formDisabled).toBe(true);

      page.root.dispatchEvent(
        new CustomEvent('formLoading', { detail: false, bubbles: false })
      );
      await page.waitForChanges();

      expect(page.rootInstance.formDisabled).toBe(false);
    });

    it('should re-initialize API when authToken changes', async () => {
      const page = await newSpecPage({
        components: [JustifiPaymentProvisioning],
        template: () => (
          <justifi-payment-provisioning
            businessId="biz_123"
            authToken={validToken}
          />
        ),
      });

      await page.waitForChanges();

      const spy = jest.spyOn(
        page.rootInstance as unknown as { initializeApi: () => void },
        'initializeApi'
      );

      page.root.authToken = createMockToken(
        Math.floor(Date.now() / 1000) + 7200
      );
      await page.waitForChanges();

      expect(spy).toHaveBeenCalled();
      spy.mockRestore();
    });

    it('should re-initialize API when businessId changes', async () => {
      const page = await newSpecPage({
        components: [JustifiPaymentProvisioning],
        template: () => (
          <justifi-payment-provisioning
            businessId="biz_123"
            authToken={validToken}
          />
        ),
      });

      await page.waitForChanges();

      const spy = jest.spyOn(
        page.rootInstance as unknown as { initializeApi: () => void },
        'initializeApi'
      );

      page.root.businessId = 'biz_456';
      await page.waitForChanges();

      expect(spy).toHaveBeenCalled();
      spy.mockRestore();
    });
  });
});
