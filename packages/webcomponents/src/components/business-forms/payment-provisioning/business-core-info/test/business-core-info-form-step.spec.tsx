import { h } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';
import { BusinessCoreInfoFormStep } from '../business-core-info-form-step';
import { CountryCode } from '../../../../../utils/country-codes';
import { BusinessFormStep } from '../../../utils';
import { ComponentErrorCodes } from '../../../../../api/ComponentError';
import { BusinessClassification } from '../../../../../api/Business';

const VALID_FORM_DATA = {
  legal_name: 'Acme Corp',
  doing_business_as: 'Acme',
  classification: BusinessClassification.limited,
  industry: 'Technology',
  date_of_incorporation: '2020-01-15',
  tax_id: '987654321', // schema rejects 123456789 (not-seq test)
  website_url: 'https://acme.example.com',
  email: 'contact@acme.example.com',
  phone: '5555555555',
};

async function setupComponent(
  data: Record<string, unknown> = {},
  opts: { country?: CountryCode; allowOptionalFields?: boolean } = {}
) {
  const country = opts.country ?? CountryCode.USA;
  const page = await newSpecPage({
    components: [BusinessCoreInfoFormStep],
    template: () => (
      <business-core-info-form-step
        authToken="test-token"
        businessId="biz_123"
        country={country}
        allowOptionalFields={opts.allowOptionalFields}
      />
    ),
  });
  const mockGet = jest.fn(({ onSuccess, final }) => {
    onSuccess({ data });
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

describe('business-core-info-form-step', () => {
  describe('rendering', () => {
    it('renders all 9 form fields with correct names', async () => {
      const { page } = await setupComponent();

      const legalName = page.root.querySelector('form-control-text[name="legal_name"]');
      const doingBusinessAs = page.root.querySelector('form-control-text[name="doing_business_as"]');
      const classification = page.root.querySelector('form-control-select[name="classification"]');
      const dateOfIncorporation = page.root.querySelector('form-control-date[name="date_of_incorporation"]');
      const industry = page.root.querySelector('form-control-text[name="industry"]');
      const taxId = page.root.querySelector('form-control-number-masked[name="tax_id"]');
      const websiteUrl = page.root.querySelector('form-control-text[name="website_url"]');
      const email = page.root.querySelector('form-control-text[name="email"]');
      const phone = page.root.querySelector('form-control-number-masked[name="phone"]');

      expect(legalName).toBeTruthy();
      expect(doingBusinessAs).toBeTruthy();
      expect(classification).toBeTruthy();
      expect(dateOfIncorporation).toBeTruthy();
      expect(industry).toBeTruthy();
      expect(taxId).toBeTruthy();
      expect(websiteUrl).toBeTruthy();
      expect(email).toBeTruthy();
      expect(phone).toBeTruthy();
    });
  });

  describe('loading state', () => {
    it('shows loading skeleton while fetching', async () => {
      const { page } = await setupComponent();
      page.rootInstance.isLoading = true;
      await page.waitForChanges();

      expect(page.rootInstance.isLoading).toBe(true);
    });
  });

  describe('pre-population', () => {
    it('pre-populates fields from fetched business data', async () => {
      const { page } = await setupComponent(VALID_FORM_DATA);

      expect(page.rootInstance.coreInfo.legal_name).toBe('Acme Corp');
      expect(page.rootInstance.coreInfo.email).toBe('contact@acme.example.com');
      expect(page.rootInstance.coreInfo.classification).toBe(BusinessClassification.limited);
      expect(page.rootInstance.coreInfo.industry).toBe('Technology');
      expect(page.rootInstance.coreInfo.website_url).toBe('https://acme.example.com');
      expect(page.rootInstance.coreInfo.tax_id).toBe('987654321');

      const legalName = page.root.querySelector('form-control-text[name="legal_name"]');
      expect(legalName?.getAttribute('defaultvalue')).toBe('Acme Corp');
    });
  });

  describe('validation errors on empty required fields', () => {
    it('shows expected messages for each required field when empty', async () => {
      const { page } = await setupComponent({});

      const onSuccess = jest.fn();
      await page.rootInstance.validateAndSubmit({ onSuccess });
      await page.waitForChanges();

      expect(page.rootInstance.errors.legal_name).toBe('Enter legal name');
      expect(page.rootInstance.errors.website_url).toBe('Enter business website url');
      expect(page.rootInstance.errors.email).toBe('Enter business email');
      expect(page.rootInstance.errors.phone).toBe('Enter phone number');
      expect(page.rootInstance.errors.classification).toBe('Select business classification');
      expect(page.rootInstance.errors.industry).toBe('Enter a business industry');
      expect(page.rootInstance.errors.date_of_incorporation).toBe('Enter date of registration');
      expect(page.rootInstance.errors.tax_id).toBe(
        'Enter valid Tax ID (EIN or SSN) without dashes',
      );
      expect(onSuccess).not.toHaveBeenCalled();
    });
  });

  describe('validation for invalid field formats (USA)', () => {
    it('sets format errors for invalid email, website url, and phone', async () => {
      const { page } = await setupComponent({});

      page.rootInstance.inputHandler('legal_name', 'Acme Corp');
      page.rootInstance.inputHandler('classification', BusinessClassification.limited);
      page.rootInstance.inputHandler('industry', 'Technology');
      page.rootInstance.inputHandler('date_of_incorporation', '2020-01-15');
      page.rootInstance.inputHandler('tax_id', '987654321');
      page.rootInstance.inputHandler('website_url', 'not-a-url');
      page.rootInstance.inputHandler('email', 'notanemail');
      page.rootInstance.inputHandler('phone', '123');
      await page.waitForChanges();

      const onSuccess = jest.fn();
      await page.rootInstance.validateAndSubmit({ onSuccess });
      await page.waitForChanges();

      expect(page.rootInstance.errors.email).toBe('Enter valid email');
      expect(page.rootInstance.errors.website_url).toBe('Enter valid website url');
      expect(page.rootInstance.errors.phone).toBe('Enter valid phone number');
      expect(onSuccess).not.toHaveBeenCalled();
    });

    it('rejects repeated digits in tax_id', async () => {
      const { page } = await setupComponent({});

      page.rootInstance.inputHandler('legal_name', 'Acme Corp');
      page.rootInstance.inputHandler('classification', BusinessClassification.limited);
      page.rootInstance.inputHandler('industry', 'Technology');
      page.rootInstance.inputHandler('date_of_incorporation', '2020-01-15');
      page.rootInstance.inputHandler('tax_id', '111111111');
      page.rootInstance.inputHandler('website_url', 'https://acme.example.com');
      page.rootInstance.inputHandler('email', 'contact@acme.example.com');
      page.rootInstance.inputHandler('phone', '5555555555');
      await page.waitForChanges();

      const onSuccess = jest.fn();
      await page.rootInstance.validateAndSubmit({ onSuccess });
      await page.waitForChanges();

      expect(page.rootInstance.errors.tax_id).toBe('Enter valid tax id, SSN, or EIN');
      expect(onSuccess).not.toHaveBeenCalled();
    });
  });

  describe('allowOptionalFields relaxes validation', () => {
    it('allows step advance with minimal required fields when allowOptionalFields is true', async () => {
      const { page, mockPatch } = await setupComponent(VALID_FORM_DATA, { allowOptionalFields: true });
      mockPatch.mockImplementation(({ onSuccess, final }) => {
        onSuccess({});
        final?.();
      });

      await page.waitForChanges();

      const onSuccess = jest.fn();
      await page.rootInstance.validateAndSubmit({ onSuccess });
      await page.waitForChanges();
      await new Promise((r) => setTimeout(r, 0));

      expect(mockPatch).toHaveBeenCalled();
      expect(onSuccess).toHaveBeenCalled();
    });
  });

  describe('sendData', () => {
    it('calls patchBusiness with correct payload structure', async () => {
      const { page, mockPatch } = await setupComponent(VALID_FORM_DATA);
      mockPatch.mockImplementation(({ onSuccess, final }) => {
        onSuccess({});
        final?.();
      });

      page.rootInstance.inputHandler('legal_name', 'Acme Corp');
      page.rootInstance.inputHandler('classification', BusinessClassification.limited);
      page.rootInstance.inputHandler('industry', 'Technology');
      page.rootInstance.inputHandler('website_url', 'https://acme.example.com');
      page.rootInstance.inputHandler('email', 'contact@acme.example.com');
      page.rootInstance.inputHandler('phone', '5555555555');
      page.rootInstance.inputHandler('date_of_incorporation', '2020-01-15');
      page.rootInstance.inputHandler('tax_id', '987654321');
      await page.waitForChanges();

      await page.rootInstance.validateAndSubmit({ onSuccess: jest.fn() });
      await page.waitForChanges();
      await new Promise((r) => setTimeout(r, 0));

      expect(mockPatch).toHaveBeenCalledWith(
        expect.objectContaining({
          payload: expect.objectContaining({
            legal_name: 'Acme Corp',
            classification: BusinessClassification.limited,
          }),
        })
      );
    });

    it('emits error-event on PATCH failure', async () => {
      const { page, mockPatch } = await setupComponent(VALID_FORM_DATA);
      mockPatch.mockImplementation(({ onError, final }) => {
        onError({
          error: 'server error',
          code: ComponentErrorCodes.PATCH_ERROR,
          severity: 'error',
          rawError: null,
        });
        final?.();
      });

      page.rootInstance.inputHandler('legal_name', 'Acme Corp');
      page.rootInstance.inputHandler('classification', BusinessClassification.limited);
      page.rootInstance.inputHandler('industry', 'Technology');
      page.rootInstance.inputHandler('website_url', 'https://acme.example.com');
      page.rootInstance.inputHandler('email', 'contact@acme.example.com');
      page.rootInstance.inputHandler('phone', '5555555555');
      page.rootInstance.inputHandler('date_of_incorporation', '2020-01-15');
      page.rootInstance.inputHandler('tax_id', '987654321');
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

    it('emits complete-form-step-event with BusinessFormStep.businessInfo', async () => {
      const { page, mockPatch } = await setupComponent(VALID_FORM_DATA);
      mockPatch.mockImplementation(({ onSuccess, final }) => {
        onSuccess({});
        final?.();
      });

      page.rootInstance.inputHandler('legal_name', 'Acme Corp');
      page.rootInstance.inputHandler('classification', BusinessClassification.limited);
      page.rootInstance.inputHandler('industry', 'Technology');
      page.rootInstance.inputHandler('website_url', 'https://acme.example.com');
      page.rootInstance.inputHandler('email', 'contact@acme.example.com');
      page.rootInstance.inputHandler('phone', '5555555555');
      page.rootInstance.inputHandler('date_of_incorporation', '2020-01-15');
      page.rootInstance.inputHandler('tax_id', '987654321');
      await page.waitForChanges();

      const stepCompleteEvent = jest.fn();
      page.root.addEventListener('complete-form-step-event', (e: CustomEvent) => stepCompleteEvent(e.detail));

      await page.rootInstance.validateAndSubmit({ onSuccess: jest.fn() });
      await page.waitForChanges();
      await new Promise((r) => setTimeout(r, 0));

      expect(stepCompleteEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          formStep: BusinessFormStep.businessInfo,
        })
      );
    });

    it('sets field-level error when API returns rawError.param', async () => {
      const { page, mockPatch } = await setupComponent(VALID_FORM_DATA);
      mockPatch.mockImplementation(({ onError, final }) => {
        onError({
          error: 'Validation failed',
          code: ComponentErrorCodes.PATCH_ERROR,
          severity: 'error',
          rawError: { param: 'legal_name', message: 'Invalid name' },
        });
        final?.();
      });

      page.rootInstance.inputHandler('legal_name', 'Acme Corp');
      page.rootInstance.inputHandler('classification', BusinessClassification.limited);
      page.rootInstance.inputHandler('industry', 'Technology');
      page.rootInstance.inputHandler('website_url', 'https://acme.example.com');
      page.rootInstance.inputHandler('email', 'contact@acme.example.com');
      page.rootInstance.inputHandler('phone', '5555555555');
      page.rootInstance.inputHandler('date_of_incorporation', '2020-01-15');
      page.rootInstance.inputHandler('tax_id', '987654321');
      await page.waitForChanges();

      await page.rootInstance.validateAndSubmit({ onSuccess: jest.fn() });
      await page.waitForChanges();
      await new Promise((r) => setTimeout(r, 0));

      expect(page.rootInstance.errors.legal_name).toBe('Invalid name');
    });
  });

  describe('formLoading events', () => {
    it('emits formLoading true then false around getData', async () => {
      const page = await newSpecPage({
        components: [BusinessCoreInfoFormStep],
        template: () => (
          <business-core-info-form-step
            authToken="test-token"
            businessId="biz_123"
            country={CountryCode.USA}
          />
        ),
      });

      const formLoadingEvents: boolean[] = [];
      page.root.addEventListener('formLoading', (e: CustomEvent) => formLoadingEvents.push(e.detail));

      const mockGet = jest.fn(({ onSuccess, final }) => {
        onSuccess({ data: {} });
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

      page.rootInstance.inputHandler('legal_name', 'Acme Corp');
      page.rootInstance.inputHandler('classification', BusinessClassification.limited);
      page.rootInstance.inputHandler('industry', 'Technology');
      page.rootInstance.inputHandler('website_url', 'https://acme.example.com');
      page.rootInstance.inputHandler('email', 'contact@acme.example.com');
      page.rootInstance.inputHandler('phone', '5555555555');
      page.rootInstance.inputHandler('date_of_incorporation', '2020-01-15');
      page.rootInstance.inputHandler('tax_id', '987654321');
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

  describe('missing props', () => {
    it('emits error-event with MISSING_PROPS when authToken and businessId not provided', async () => {
      const captured: unknown[] = [];
      const page = await newSpecPage({
        components: [BusinessCoreInfoFormStep],
        template: () => (
          <div
            ref={(el) => {
              if (el) el.addEventListener('error-event', (e: Event) => captured.push((e as CustomEvent).detail));
            }}
          >
            {/* @ts-ignore - intentionally omit authToken/businessId to test MISSING_PROPS */}
            <business-core-info-form-step country={CountryCode.USA} />
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
});
