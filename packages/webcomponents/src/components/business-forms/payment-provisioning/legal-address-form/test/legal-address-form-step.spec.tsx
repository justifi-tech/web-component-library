import { h } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';
import { LegalAddressFormStep } from '../legal-address-form-step';
import { BusinessFormStep } from '../../../utils';
import { ComponentErrorCodes } from '../../../../../api/ComponentError';
import { CountryCode } from '../../../../../utils/country-codes';

const VALID_ADDRESS_DATA = {
  line1: '123 Main St',
  line2: 'Suite 100',
  city: 'New York',
  state: 'NY',
  postal_code: '10001',
};

async function setupComponent(
  addressData: Record<string, unknown> = {},
  opts: { country?: CountryCode; allowOptionalFields?: boolean } = {}
) {
  const country = opts.country ?? CountryCode.USA;
  const page = await newSpecPage({
    components: [LegalAddressFormStep],
    template: () => (
      <legal-address-form-step
        authToken="test-token"
        businessId="biz_123"
        country={country}
        allowOptionalFields={opts.allowOptionalFields}
      />
    ),
  });
  const mockGet = jest.fn(({ onSuccess, final }) => {
    onSuccess({ data: { legal_address: addressData } });
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

describe('legal-address-form-step', () => {
  describe('missing props', () => {
    it('emits error-event with MISSING_PROPS when authToken and businessId not provided', async () => {
      const captured: unknown[] = [];
      const page = await newSpecPage({
        components: [LegalAddressFormStep],
        template: () => (
          <div
            ref={(el) => {
              if (el) el.addEventListener('error-event', (e: Event) => captured.push((e as CustomEvent).detail));
            }}
          >
            {/* @ts-ignore - intentionally omit authToken/businessId; country required so schemaFactory does not crash */}
            <legal-address-form-step country={CountryCode.USA} />
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
    it('renders form-address-fields with correct country prop', async () => {
      const { page } = await setupComponent({}, { country: CountryCode.USA });

      const formAddressFields = page.root.querySelector('form-address-fields');
      expect(formAddressFields).toBeTruthy();
      expect(formAddressFields.getAttribute('country')).toBe(CountryCode.USA);
    });

    it('renders form-control-tooltip with "No PO Boxes."', async () => {
      const { page } = await setupComponent();

      const tooltip = page.root.querySelector('form-control-tooltip');
      expect(tooltip).toBeTruthy();
      expect(tooltip.getAttribute('helptext')).toBe('No PO Boxes.');
    });

    it('renders form-address-fields with CAN country', async () => {
      const { page } = await setupComponent({}, { country: CountryCode.CAN });

      const formAddressFields = page.root.querySelector('form-address-fields');
      expect(formAddressFields).toBeTruthy();
      expect(formAddressFields.getAttribute('country')).toBe(CountryCode.CAN);
    });
  });

  describe('loading state', () => {
    it('shows loading state while fetching', async () => {
      const { page } = await setupComponent();
      page.rootInstance.isLoading = true;
      await page.waitForChanges();

      expect(page.root.querySelector('form')).toBeFalsy();
      expect(page.root.querySelector('form-address-fields')).toBeFalsy();
    });
  });

  describe('pre-population', () => {
    it('pre-populates from response.data.legal_address', async () => {
      const { page } = await setupComponent(VALID_ADDRESS_DATA);

      expect(page.rootInstance.legal_address.line1).toBe('123 Main St');
      expect(page.rootInstance.legal_address.city).toBe('New York');
      expect(page.rootInstance.legal_address.state).toBe('NY');
      expect(page.rootInstance.legal_address.postal_code).toBe('10001');
    });
  });

  describe('formController', () => {
    it('instantiates FormController on load', async () => {
      const { page } = await setupComponent();

      expect(page.rootInstance.formController).toBeTruthy();
    });
  });

  describe('validation (USA)', () => {
    it('shows validation errors for required fields when empty', async () => {
      const { page } = await setupComponent({}, { country: CountryCode.USA });

      const onSuccess = jest.fn();
      await page.rootInstance.validateAndSubmit({ onSuccess });
      await page.waitForChanges();

      expect(page.rootInstance.errors.line1).toBeTruthy();
      expect(page.rootInstance.errors.city).toBeTruthy();
      expect(page.rootInstance.errors.state).toBeTruthy();
      expect(page.rootInstance.errors.postal_code).toBeTruthy();
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

  describe('validation (CAN)', () => {
    it('state error message is "Select province"', async () => {
      const { page } = await setupComponent({}, { country: CountryCode.CAN });

      await page.rootInstance.validateAndSubmit({ onSuccess: jest.fn() });
      await page.waitForChanges();

      expect(page.rootInstance.errors.state).toContain('Select province');
    });
  });

  describe('fetchData', () => {
    it('calls getBusiness when rendered with valid props', async () => {
      const { mockGet } = await setupComponent();

      expect(mockGet).toHaveBeenCalled();
    });

    it('emits error-event on fetch failure', async () => {
      const page = await newSpecPage({
        components: [LegalAddressFormStep],
        template: () => (
          <legal-address-form-step
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

    it('emits formLoading true then false around getData', async () => {
      const page = await newSpecPage({
        components: [LegalAddressFormStep],
        template: () => (
          <legal-address-form-step
            authToken="test-token"
            businessId="biz_123"
            country={CountryCode.USA}
          />
        ),
      });

      const formLoadingEvents: boolean[] = [];
      page.root.addEventListener('formLoading', (e: CustomEvent) => formLoadingEvents.push(e.detail));

      const mockGet = jest.fn(({ onSuccess, final }) => {
        onSuccess({ data: { legal_address: {} } });
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
  });

  describe('sendData', () => {
    it('calls patchBusiness with payload wrapped as { legal_address: formValues }', async () => {
      const { page, mockPatch } = await setupComponent(VALID_ADDRESS_DATA);
      mockPatch.mockImplementation(({ onSuccess, final }) => {
        onSuccess({});
        final?.();
      });

      page.rootInstance.inputHandler('line1', '123 Main St');
      page.rootInstance.inputHandler('city', 'New York');
      page.rootInstance.inputHandler('state', 'NY');
      page.rootInstance.inputHandler('postal_code', '10001');
      await page.waitForChanges();

      await page.rootInstance.validateAndSubmit({ onSuccess: jest.fn() });
      await page.waitForChanges();
      await new Promise((r) => setTimeout(r, 0));

      expect(mockPatch).toHaveBeenCalledWith(
        expect.objectContaining({
          payload: expect.objectContaining({
            legal_address: expect.objectContaining({
              line1: '123 Main St',
              city: 'New York',
              state: 'NY',
              postal_code: '10001',
            }),
          }),
        })
      );
    });

    it('emits error-event on patch failure', async () => {
      const { page, mockPatch } = await setupComponent(VALID_ADDRESS_DATA);
      mockPatch.mockImplementation(({ onError, final }) => {
        onError({
          error: 'server error',
          code: ComponentErrorCodes.PATCH_ERROR,
          severity: 'error',
        });
        final?.();
      });

      page.rootInstance.inputHandler('line1', '123 Main St');
      page.rootInstance.inputHandler('city', 'New York');
      page.rootInstance.inputHandler('state', 'NY');
      page.rootInstance.inputHandler('postal_code', '10001');
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

    it('emits complete-form-step-event with BusinessFormStep.legalAddress', async () => {
      const { page, mockPatch } = await setupComponent(VALID_ADDRESS_DATA);
      mockPatch.mockImplementation(({ onSuccess, final }) => {
        onSuccess({});
        final?.();
      });

      page.rootInstance.inputHandler('line1', '123 Main St');
      page.rootInstance.inputHandler('city', 'New York');
      page.rootInstance.inputHandler('state', 'NY');
      page.rootInstance.inputHandler('postal_code', '10001');
      await page.waitForChanges();

      const stepCompleteEvent = jest.fn();
      page.root.addEventListener('complete-form-step-event', (e: CustomEvent) => stepCompleteEvent(e.detail));

      await page.rootInstance.validateAndSubmit({ onSuccess: jest.fn() });
      await page.waitForChanges();
      await new Promise((r) => setTimeout(r, 0));

      expect(stepCompleteEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          formStep: BusinessFormStep.legalAddress,
        })
      );
    });

    it('emits formLoading true then false around sendData', async () => {
      const { page, mockPatch } = await setupComponent(VALID_ADDRESS_DATA);
      mockPatch.mockImplementation(({ onSuccess, final }) => {
        onSuccess({});
        final?.();
      });

      page.rootInstance.inputHandler('line1', '123 Main St');
      page.rootInstance.inputHandler('city', 'New York');
      page.rootInstance.inputHandler('state', 'NY');
      page.rootInstance.inputHandler('postal_code', '10001');
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
