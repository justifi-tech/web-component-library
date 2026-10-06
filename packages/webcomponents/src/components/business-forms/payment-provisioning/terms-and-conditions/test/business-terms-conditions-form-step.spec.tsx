import { h } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';
import { BusinessTermsConditionsFormStep } from '../business-terms-conditions-form-step';
import { BusinessFormStep } from '../../../utils';
import { ComponentErrorCodes } from '../../../../../api/ComponentError';

async function setupComponent(termsAccepted = false) {
  const page = await newSpecPage({
    components: [BusinessTermsConditionsFormStep],
    template: () => (
      <business-terms-conditions-form-step
        authToken="test-token"
        businessId="biz_123"
      />
    ),
  });

  const mockGet = jest.fn().mockResolvedValue({
    data: { terms_conditions_accepted: termsAccepted },
  });
  const mockPost = jest.fn().mockResolvedValue({ data: {} });
  // @ts-ignore
  page.rootInstance.api = { get: mockGet, post: mockPost };
  // @ts-ignore
  await page.rootInstance.fetchData();
  await page.waitForChanges();

  return { page, mockGet, mockPost };
}

beforeEach(() => {
  jest.clearAllMocks();
});

describe('business-terms-conditions-form-step', () => {
  describe('rendering', () => {
    it('renders form-control-checkbox with name accepted and label', async () => {
      const { page } = await setupComponent();

      const checkbox = page.root.querySelector('form-control-checkbox');
      expect(checkbox).toBeTruthy();
      expect(checkbox.getAttribute('name')).toBe('accepted');
      expect(checkbox.getAttribute('label')).toBe('I agree to the terms and conditions');
    });

    it('renders merchant agreement link with correct href and target', async () => {
      const { page } = await setupComponent();

      const link = page.root.querySelector('a[href="https://justifi.tech/merchant-agreement/"]');
      expect(link).toBeTruthy();
      expect(link.getAttribute('target')).toBe('_blank');
    });
  });

  describe('when acceptedTermsBefore is true', () => {
    it('checkbox has disabled attribute', async () => {
      const { page } = await setupComponent(true);

      const checkbox = page.root.querySelector('form-control-checkbox');
      expect(checkbox.getAttribute('disabled')).not.toBeNull();
    });

    it('form-control-checkbox receives helpText about already accepted', async () => {
      const { page } = await setupComponent(true);

      const checkbox = page.root.querySelector('form-control-checkbox');
      expect(checkbox.getAttribute('helptext')).toBe('You have already accepted the terms and conditions.');
    });
  });

  describe('validateAndSubmit - already accepted path', () => {
    it('does not call POST, emits stepCompleteEvent, formCompleted, and calls onSuccess', async () => {
      const { page, mockPost } = await setupComponent(true);

      const stepCompleteEvent = jest.fn();
      const formCompletedEvent = jest.fn();
      const onSuccess = jest.fn();

      page.root.addEventListener('complete-form-step-event', stepCompleteEvent);
      page.root.addEventListener('formCompleted', formCompletedEvent);

      await page.rootInstance.validateAndSubmit({ onSuccess });
      await page.waitForChanges();

      expect(mockPost).not.toHaveBeenCalled();
      expect(stepCompleteEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          detail: expect.objectContaining({
            response: null,
            formStep: BusinessFormStep.termsAndConditions,
            metadata: 'no data submitted',
          }),
        })
      );
      expect(formCompletedEvent).toHaveBeenCalled();
      expect(onSuccess).toHaveBeenCalled();
    });
  });

  describe('validateAndSubmit - not yet accepted, valid form', () => {
    it('calls POST with correct payload, emits events, calls onSuccess', async () => {
      const { page, mockPost } = await setupComponent(false);

      page.rootInstance.inputHandler('accepted', true);
      await page.waitForChanges();

      const stepCompleteEvent = jest.fn();
      const formCompletedEvent = jest.fn();
      const onSuccess = jest.fn();

      page.root.addEventListener('complete-form-step-event', stepCompleteEvent);
      page.root.addEventListener('formCompleted', formCompletedEvent);

      await page.rootInstance.validateAndSubmit({ onSuccess });
      await page.waitForChanges();

      expect(mockPost).toHaveBeenCalledWith(
        expect.objectContaining({
          endpoint: 'entities/terms_and_conditions',
          body: expect.objectContaining({
            business_id: 'biz_123',
            accepted: true,
            user_agent: expect.any(String),
          }),
        })
      );
      expect(stepCompleteEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          detail: expect.objectContaining({
            formStep: BusinessFormStep.termsAndConditions,
          }),
        })
      );
      expect(formCompletedEvent).toHaveBeenCalled();
      expect(onSuccess).toHaveBeenCalled();
    });
  });

  describe('validateAndSubmit - not yet accepted, checkbox untouched', () => {
    it('does not call POST and sets validation error', async () => {
      const { page, mockPost } = await setupComponent(false);

      await page.rootInstance.validateAndSubmit({ onSuccess: jest.fn() });
      await page.waitForChanges();

      expect(mockPost).not.toHaveBeenCalled();
      expect(page.rootInstance.errors.accepted).toBeTruthy();
    });
  });

  describe('error-event on fetchData failure', () => {
    it('emits error-event with FETCH_ERROR', async () => {
      const page = await newSpecPage({
        components: [BusinessTermsConditionsFormStep],
        template: () => (
          <business-terms-conditions-form-step
            authToken="test-token"
            businessId="biz_123"
          />
        ),
      });

      const mockGet = jest.fn().mockRejectedValue(new Error('fetch failed'));
      // @ts-ignore
      page.rootInstance.api = { get: mockGet, post: jest.fn() };

      const errorEvent = jest.fn();
      page.root.addEventListener('error-event', (e: CustomEvent) => errorEvent(e.detail));

      // @ts-ignore
      await page.rootInstance.fetchData();
      await page.waitForChanges();

      expect(errorEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          errorCode: ComponentErrorCodes.FETCH_ERROR,
          message: 'fetch failed',
        })
      );
    });
  });

  describe('error-event on POST failure', () => {
    it('emits error-event with POST_ERROR when sendData throws', async () => {
      const { page, mockPost } = await setupComponent(false);

      mockPost.mockRejectedValueOnce(new Error('post failed'));

      page.rootInstance.inputHandler('accepted', true);
      await page.waitForChanges();

      const errorEvent = jest.fn();
      page.root.addEventListener('error-event', (e: CustomEvent) => errorEvent(e.detail));

      await page.rootInstance.validateAndSubmit({ onSuccess: jest.fn() });
      await page.waitForChanges();

      expect(errorEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          errorCode: ComponentErrorCodes.POST_ERROR,
          message: 'post failed',
        })
      );
    });
  });

  describe('error-event on POST response.error', () => {
    it('emits error-event when handleResponse receives error', async () => {
      const { page, mockPost } = await setupComponent(false);

      mockPost.mockResolvedValueOnce({ error: { message: 'api error' } });

      page.rootInstance.inputHandler('accepted', true);
      await page.waitForChanges();

      const errorEvent = jest.fn();
      const stepCompleteEvent = jest.fn();
      const formCompletedEvent = jest.fn();
      page.root.addEventListener('error-event', (e: CustomEvent) => errorEvent(e.detail));
      page.root.addEventListener('complete-form-step-event', stepCompleteEvent);
      page.root.addEventListener('formCompleted', formCompletedEvent);

      await page.rootInstance.validateAndSubmit({ onSuccess: jest.fn() });
      await page.waitForChanges();

      expect(errorEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          errorCode: ComponentErrorCodes.POST_ERROR,
          message: 'api error',
        })
      );
      expect(stepCompleteEvent).toHaveBeenCalled();
      expect(formCompletedEvent).toHaveBeenCalled();
    });
  });

  describe('formLoading events', () => {
    it('emits formLoading true then false around fetchData', async () => {
      const page = await newSpecPage({
        components: [BusinessTermsConditionsFormStep],
        template: () => (
          <business-terms-conditions-form-step
            authToken="test-token"
            businessId="biz_123"
          />
        ),
      });

      const mockGet = jest.fn().mockImplementation(() => {
        return new Promise((resolve) => {
          setTimeout(() => resolve({ data: { terms_conditions_accepted: false } }), 0);
        });
      });
      // @ts-ignore
      page.rootInstance.api = { get: mockGet, post: jest.fn() };

      const formLoadingEvents: boolean[] = [];
      page.root.addEventListener('formLoading', (e: CustomEvent) => formLoadingEvents.push(e.detail));

      // @ts-ignore
      await page.rootInstance.fetchData();
      await page.waitForChanges();

      expect(formLoadingEvents).toContain(true);
      expect(formLoadingEvents).toContain(false);
    });

    it('emits formLoading true then false around sendData', async () => {
      const { page } = await setupComponent(false);

      page.rootInstance.inputHandler('accepted', true);
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
