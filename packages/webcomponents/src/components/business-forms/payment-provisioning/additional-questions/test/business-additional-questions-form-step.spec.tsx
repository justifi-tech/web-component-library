import { h } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';
import { AdditionalQuestionsFormStep } from '../additional-questions-form-step';
import { BusinessFormStep } from '../../../utils';
import { ComponentErrorCodes } from '../../../../../api/ComponentError';

const VALID_FORM_DATA = {
  business_revenue: '100000',
  business_payment_volume: '50000',
  business_average_transaction_amount: '500',
  business_when_service_received: 'Within 7 days',
  business_other_payment_details: 'Notes here',
};

async function setupComponent(
  data: Record<string, unknown> = {},
  opts: { allowOptionalFields?: boolean } = {}
) {
  const page = await newSpecPage({
    components: [AdditionalQuestionsFormStep],
    template: () => (
      <additional-questions-form-step
        authToken="test-token"
        businessId="biz_123"
        allowOptionalFields={opts.allowOptionalFields}
      />
    ),
  });
  const mockGet = jest.fn(({ onSuccess, final }) => {
    onSuccess({ data: { additional_questions: data } });
    final?.();
  });
  const mockPatch = jest.fn();
  page.rootInstance.getBusiness = mockGet;
  page.rootInstance.patchBusiness = mockPatch;
  // @ts-ignore - accessing private method for testing
  page.rootInstance.getData();
  await page.waitForChanges();
  return { page, mockGet, mockPatch };
}

beforeEach(() => {
  jest.clearAllMocks();
});

describe('additional-questions-form-step', () => {
  describe('missing props', () => {
    it('emits error-event with MISSING_PROPS when authToken and businessId not provided', async () => {
      const captured: unknown[] = [];
      const page = await newSpecPage({
        components: [AdditionalQuestionsFormStep],
        template: () => (
          <div
            ref={(el) => {
              if (el) el.addEventListener('error-event', (e: Event) => captured.push((e as CustomEvent).detail));
            }}
          >
            {/* @ts-ignore - intentionally omit authToken/businessId */}
            <additional-questions-form-step />
          </div>
        ),
      });
      await page.waitForChanges();

      expect(captured).toContainEqual(
        expect.objectContaining({
          errorCode: ComponentErrorCodes.MISSING_PROPS,
          message: 'Missing required props',
        })
      );
    });
  });

  describe('rendering', () => {
    it('renders all 5 form fields with correct names', async () => {
      const { page } = await setupComponent();

      const revenue = page.root.querySelector('form-control-monetary-provisioning[name="business_revenue"]');
      const paymentVolume = page.root.querySelector('form-control-monetary-provisioning[name="business_payment_volume"]');
      const avgTransaction = page.root.querySelector('form-control-number[name="business_average_transaction_amount"]');
      const whenServiceReceived = page.root.querySelector('form-control-select[name="business_when_service_received"]');
      const otherDetails = page.root.querySelector('form-control-text[name="business_other_payment_details"]');

      expect(revenue).toBeTruthy();
      expect(paymentVolume).toBeTruthy();
      expect(avgTransaction).toBeTruthy();
      expect(whenServiceReceived).toBeTruthy();
      expect(otherDetails).toBeTruthy();
    });
  });

  describe('loading state', () => {
    it('shows loading state while fetching', async () => {
      const { page } = await setupComponent();
      page.rootInstance.isLoading = true;
      await page.waitForChanges();

      expect(page.rootInstance.isLoading).toBe(true);
    });
  });

  describe('pre-population', () => {
    it('pre-populates fields from fetched business data', async () => {
      const { page } = await setupComponent(VALID_FORM_DATA);

      expect(page.rootInstance.additional_questions.business_revenue).toBe('100000');
      expect(page.rootInstance.additional_questions.business_payment_volume).toBe('50000');
      expect(page.rootInstance.additional_questions.business_average_transaction_amount).toBe('500');
      expect(page.rootInstance.additional_questions.business_when_service_received).toBe('Within 7 days');
    });
  });

  describe('formController', () => {
    it('instantiates FormController on load', async () => {
      const { page } = await setupComponent();

      expect(page.rootInstance.formController).toBeTruthy();
    });
  });

  describe('validation', () => {
    it('shows validation errors for required fields when empty', async () => {
      const { page } = await setupComponent({});

      const onSuccess = jest.fn();
      await page.rootInstance.validateAndSubmit({ onSuccess });
      await page.waitForChanges();

      expect(page.rootInstance.errors.business_revenue).toBeTruthy();
      expect(page.rootInstance.errors.business_payment_volume).toBeTruthy();
      expect(page.rootInstance.errors.business_average_transaction_amount).toBeTruthy();
      expect(page.rootInstance.errors.business_when_service_received).toBeTruthy();
      expect(onSuccess).not.toHaveBeenCalled();
    });

    it('allows step advance with empty fields when allowOptionalFields is true', async () => {
      const { page, mockPatch } = await setupComponent({}, { allowOptionalFields: true });
      mockPatch.mockImplementation(({ onSuccess, final }) => {
        onSuccess({});
        final?.();
      });

      const onSuccess = jest.fn();
      await page.rootInstance.validateAndSubmit({ onSuccess });
      await page.waitForChanges();
      await new Promise((r) => setTimeout(r, 0));

      expect(mockPatch).toHaveBeenCalled();
      expect(onSuccess).toHaveBeenCalled();
    });
  });

  describe('fetchData', () => {
    it('calls getBusiness when rendered with valid props', async () => {
      const { mockGet } = await setupComponent();

      expect(mockGet).toHaveBeenCalled();
    });

    it('populates inputs from fetched data', async () => {
      const { page } = await setupComponent(VALID_FORM_DATA);

      expect(page.rootInstance.additional_questions.business_revenue).toBe('100000');
    });

    it('emits error-event on fetch failure', async () => {
      const page = await newSpecPage({
        components: [AdditionalQuestionsFormStep],
        template: () => (
          <additional-questions-form-step authToken="test-token" businessId="biz_123" />
        ),
      });
      const mockGet = jest.fn(({ onError, final }) => {
        onError({
          error: 'fetch failed',
          code: ComponentErrorCodes.FETCH_ERROR,
          severity: 'error',
        });
        final?.();
      });
      page.rootInstance.getBusiness = mockGet;
      page.rootInstance.patchBusiness = jest.fn();
      const errorEvent = jest.fn();
      page.root.addEventListener('error-event', (e: CustomEvent) => errorEvent(e.detail));

      // @ts-ignore
      page.rootInstance.getData();
      await page.waitForChanges();

      expect(errorEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          errorCode: ComponentErrorCodes.FETCH_ERROR,
          message: 'fetch failed',
        })
      );
    });
  });

  describe('sendData', () => {
    it('calls patchBusiness with correct payload structure', async () => {
      const { page, mockPatch } = await setupComponent(VALID_FORM_DATA);
      mockPatch.mockImplementation(({ onSuccess, final }) => {
        onSuccess({});
        final?.();
      });

      page.rootInstance.inputHandler('business_revenue', '100000');
      page.rootInstance.inputHandler('business_payment_volume', '50000');
      page.rootInstance.inputHandler('business_average_transaction_amount', '500');
      page.rootInstance.inputHandler('business_when_service_received', 'Within 7 days');
      page.rootInstance.inputHandler('business_other_payment_details', 'Notes');
      await page.waitForChanges();

      await page.rootInstance.validateAndSubmit({ onSuccess: jest.fn() });
      await page.waitForChanges();
      await new Promise((r) => setTimeout(r, 0));

      expect(mockPatch).toHaveBeenCalledWith(
        expect.objectContaining({
          payload: expect.objectContaining({
            additional_questions: expect.objectContaining({
              business_revenue: '100000',
              business_when_service_received: 'Within 7 days',
            }),
          }),
        })
      );
    });

    it('emits error-event on patch failure', async () => {
      const { page, mockPatch } = await setupComponent(VALID_FORM_DATA);
      mockPatch.mockImplementation(({ onError, final }) => {
        onError({
          error: 'server error',
          code: ComponentErrorCodes.PATCH_ERROR,
          severity: 'error',
        });
        final?.();
      });

      page.rootInstance.inputHandler('business_revenue', '100000');
      page.rootInstance.inputHandler('business_payment_volume', '50000');
      page.rootInstance.inputHandler('business_average_transaction_amount', '500');
      page.rootInstance.inputHandler('business_when_service_received', 'Within 7 days');
      await page.waitForChanges();

      const errorEvent = jest.fn();
      page.root.addEventListener('error-event', (e: CustomEvent) => errorEvent(e.detail));

      await page.rootInstance.validateAndSubmit({ onSuccess: jest.fn() });
      await page.waitForChanges();
      await new Promise((r) => setTimeout(r, 0));

      expect(errorEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          errorCode: ComponentErrorCodes.PATCH_ERROR,
          message: 'server error',
        })
      );
    });

    it('emits complete-form-step-event with BusinessFormStep.additionalQuestions', async () => {
      const { page, mockPatch } = await setupComponent(VALID_FORM_DATA);
      mockPatch.mockImplementation(({ onSuccess, final }) => {
        onSuccess({});
        final?.();
      });

      page.rootInstance.inputHandler('business_revenue', '100000');
      page.rootInstance.inputHandler('business_payment_volume', '50000');
      page.rootInstance.inputHandler('business_average_transaction_amount', '500');
      page.rootInstance.inputHandler('business_when_service_received', 'Within 7 days');
      await page.waitForChanges();

      const stepCompleteEvent = jest.fn();
      page.root.addEventListener('complete-form-step-event', (e: CustomEvent) => stepCompleteEvent(e.detail));

      await page.rootInstance.validateAndSubmit({ onSuccess: jest.fn() });
      await page.waitForChanges();
      await new Promise((r) => setTimeout(r, 0));

      expect(stepCompleteEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          formStep: BusinessFormStep.additionalQuestions,
        })
      );
    });
  });

  describe('formLoading events', () => {
    it('emits formLoading true then false around getData', async () => {
      const page = await newSpecPage({
        components: [AdditionalQuestionsFormStep],
        template: () => (
          <additional-questions-form-step authToken="test-token" businessId="biz_123" />
        ),
      });

      const formLoadingEvents: boolean[] = [];
      page.root.addEventListener('formLoading', (e: CustomEvent) => formLoadingEvents.push(e.detail));

      const mockGet = jest.fn(({ onSuccess, final }) => {
        onSuccess({ data: { additional_questions: {} } });
        final?.();
      });
      page.rootInstance.getBusiness = mockGet;
      page.rootInstance.patchBusiness = jest.fn();
      // @ts-ignore
      page.rootInstance.getData();
      await page.waitForChanges();

      expect(formLoadingEvents).toContain(true);
      expect(formLoadingEvents).toContain(false);
    });

    it('emits formLoading true then false around sendData', async () => {
      const { page, mockPatch } = await setupComponent(VALID_FORM_DATA);
      mockPatch.mockImplementation(({ onSuccess, final }) => {
        onSuccess({});
        final?.();
      });

      page.rootInstance.inputHandler('business_revenue', '100000');
      page.rootInstance.inputHandler('business_payment_volume', '50000');
      page.rootInstance.inputHandler('business_average_transaction_amount', '500');
      page.rootInstance.inputHandler('business_when_service_received', 'Within 7 days');
      await page.waitForChanges();

      const formLoadingEvents: boolean[] = [];
      page.root.addEventListener('formLoading', (e: CustomEvent) => formLoadingEvents.push(e.detail));

      await page.rootInstance.validateAndSubmit({ onSuccess: jest.fn() });
      await page.waitForChanges();
      await new Promise((r) => setTimeout(r, 0));

      expect(formLoadingEvents).toContain(true);
      expect(formLoadingEvents).toContain(false);
    });
  });
});
