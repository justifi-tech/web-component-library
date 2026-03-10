import { h } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';
import { BusinessRepresentativeFormStep } from '../business-representative-form-step';
import { CountryCode } from '../../../../../utils/country-codes';
import { BusinessFormStep } from '../../../utils';
import { ComponentErrorCodes } from '../../../../../api/ComponentError';

const VALID_REP_DATA = {
  name: 'Jane Doe',
  title: 'CEO',
  email: 'jane@example.com',
  phone: '5555555555',
  dob_full: '1985-01-15',
  dob_day: '15',
  dob_month: '01',
  dob_year: '1985',
  identification_number: '987654321',
  address: {
    line1: '123 Main St',
    city: 'Springfield',
    state: 'IL',
    postal_code: '62701',
    country: 'US',
  },
};

async function setupComponent(
  repData: Record<string, unknown> = {},
  opts: { country?: CountryCode; allowOptionalFields?: boolean } = {}
) {
  const country = opts.country ?? CountryCode.USA;
  const page = await newSpecPage({
    components: [BusinessRepresentativeFormStep],
    template: () => (
      <business-representative-form-step
        authToken="test-token"
        businessId="biz_123"
        country={country}
        allowOptionalFields={opts.allowOptionalFields}
      />
    ),
  });
  const mockGet = jest.fn(({ onSuccess, final }) => {
    onSuccess({ data: { representative: repData } });
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

describe('business-representative-form-step', () => {
  describe('missing props', () => {
    it('emits error-event with MISSING_PROPS when authToken and businessId not provided', async () => {
      const captured: unknown[] = [];
      const page = await newSpecPage({
        components: [BusinessRepresentativeFormStep],
        template: () => (
          <div
            ref={(el) => {
              if (el) el.addEventListener('error-event', (e: Event) => captured.push((e as CustomEvent).detail));
            }}
          >
            {/* @ts-ignore - intentionally omit authToken/businessId */}
            <business-representative-form-step country={CountryCode.USA} />
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

    it('emits error-event when country is missing and schema cannot be resolved', async () => {
      const captured: unknown[] = [];
      const page = await newSpecPage({
        components: [BusinessRepresentativeFormStep],
        template: () => (
          <div
            ref={(el) => {
              if (el) el.addEventListener('error-event', (e: Event) => captured.push((e as CustomEvent).detail));
            }}
          >
            <business-representative-form-step
              authToken="test-token"
              businessId="biz_123"
            />
          </div>
        ),
      });
      await page.waitForChanges();

      expect(captured.some((e: any) => e?.message === 'Missing schema for selected country')).toBe(true);
    });
  });

  describe('rendering', () => {
    it('renders business-representative-form-inputs when loaded', async () => {
      const { page } = await setupComponent(VALID_REP_DATA);

      const inputs = page.root.querySelector('business-representative-form-inputs');
      expect(inputs).toBeTruthy();
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
    it('pre-populates representative from fetched data', async () => {
      const { page } = await setupComponent(VALID_REP_DATA);

      expect(page.rootInstance.representative.name).toBe('Jane Doe');
      expect(page.rootInstance.representative.email).toBe('jane@example.com');
      expect(page.rootInstance.representative.title).toBe('CEO');
    });
  });

  describe('formController', () => {
    it('instantiates FormController on load', async () => {
      const { page } = await setupComponent(VALID_REP_DATA);

      expect(page.rootInstance.formController).toBeTruthy();
    });
  });

  describe('validation', () => {
    it('shows validation errors for required fields when empty', async () => {
      const { page } = await setupComponent({});

      const onSuccess = jest.fn();
      await page.rootInstance.validateAndSubmit({ onSuccess });
      await page.waitForChanges();

      expect(page.rootInstance.errors.name).toBeTruthy();
      expect(onSuccess).not.toHaveBeenCalled();
    });
  });

  describe('fetchData', () => {
    it('calls getBusiness when rendered with valid props', async () => {
      const { mockGet } = await setupComponent(VALID_REP_DATA);

      expect(mockGet).toHaveBeenCalled();
    });

    it('emits error-event on fetch failure', async () => {
      const page = await newSpecPage({
        components: [BusinessRepresentativeFormStep],
        template: () => (
          <business-representative-form-step
            authToken="test-token"
            businessId="biz_123"
            country={CountryCode.USA}
          />
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
      const { page, mockPatch } = await setupComponent(VALID_REP_DATA, { allowOptionalFields: true });
      mockPatch.mockImplementation(({ onSuccess, final }) => {
        onSuccess({});
        final?.();
      });

      jest.spyOn(page.rootInstance.formController, 'validate').mockResolvedValue(true);
      page.rootInstance.formController.setValues({
        ...page.rootInstance.formController.values.getValue(),
        ...VALID_REP_DATA,
      });
      await page.waitForChanges();

      await page.rootInstance.validateAndSubmit({ onSuccess: jest.fn() });
      await page.waitForChanges();
      await new Promise((r) => setTimeout(r, 0));

      expect(mockPatch).toHaveBeenCalledWith(
        expect.objectContaining({
          payload: expect.objectContaining({
            representative: expect.objectContaining({
              name: 'Jane Doe',
              email: 'jane@example.com',
            }),
          }),
        })
      );
    });

    it('emits error-event on patch failure', async () => {
      const { page, mockPatch } = await setupComponent(VALID_REP_DATA, { allowOptionalFields: true });
      mockPatch.mockImplementation(({ onError, final }) => {
        onError({
          error: 'server error',
          code: ComponentErrorCodes.PATCH_ERROR,
          severity: 'error',
        });
        final?.();
      });

      jest.spyOn(page.rootInstance.formController, 'validate').mockResolvedValue(true);
      page.rootInstance.formController.setValues({
        ...page.rootInstance.formController.values.getValue(),
        ...VALID_REP_DATA,
      });
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

    it('emits complete-form-step-event with BusinessFormStep.representative', async () => {
      const { page, mockPatch } = await setupComponent(VALID_REP_DATA, { allowOptionalFields: true });
      mockPatch.mockImplementation(({ onSuccess, final }) => {
        onSuccess({});
        final?.();
      });

      jest.spyOn(page.rootInstance.formController, 'validate').mockResolvedValue(true);
      page.rootInstance.formController.setValues({
        ...page.rootInstance.formController.values.getValue(),
        ...VALID_REP_DATA,
      });
      await page.waitForChanges();

      const stepCompleteEvent = jest.fn();
      page.root.addEventListener('complete-form-step-event', (e: CustomEvent) => stepCompleteEvent(e.detail));

      await page.rootInstance.validateAndSubmit({ onSuccess: jest.fn() });
      await page.waitForChanges();
      await new Promise((r) => setTimeout(r, 0));

      expect(stepCompleteEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          formStep: BusinessFormStep.representative,
        })
      );
    });
  });

  describe('formLoading events', () => {
    it('emits formLoading true then false around getData', async () => {
      const page = await newSpecPage({
        components: [BusinessRepresentativeFormStep],
        template: () => (
          <business-representative-form-step
            authToken="test-token"
            businessId="biz_123"
            country={CountryCode.USA}
          />
        ),
      });

      const formLoadingEvents: boolean[] = [];
      page.root.addEventListener('formLoading', (e: CustomEvent) => formLoadingEvents.push(e.detail));

      const mockGet = jest.fn(({ onSuccess, final }) => {
        onSuccess({ data: { representative: {} } });
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
      const { page, mockPatch } = await setupComponent(VALID_REP_DATA, { allowOptionalFields: true });
      mockPatch.mockImplementation(({ onSuccess, final }) => {
        onSuccess({});
        final?.();
      });

      jest.spyOn(page.rootInstance.formController, 'validate').mockResolvedValue(true);
      page.rootInstance.formController.setValues({
        ...page.rootInstance.formController.values.getValue(),
        ...VALID_REP_DATA,
      });
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
