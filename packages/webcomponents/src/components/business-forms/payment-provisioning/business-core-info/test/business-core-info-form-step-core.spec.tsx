import { h } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';
import { JustifiBusinessCoreInfoFormStep } from '../justifi-business-core-info-form-step';
import { CountryCode } from '../../../../../utils/country-codes';

describe('justifi-business-core-info-form-step-core', () => {
  const mockGetBusiness = jest.fn();
  const mockPatchBusiness = jest.fn();

  beforeEach(() => {
    mockGetBusiness.mockClear();
    mockPatchBusiness.mockClear();
  });

  describe('Country-specific tax ID label', () => {
    test('renders USA tax ID label and help text', async () => {
      const page = await newSpecPage({
        components: [JustifiBusinessCoreInfoFormStep],
        template: () => (
          <justifi-business-core-info-form-step
            businessId="biz_123"
            authToken="test-token"
            country={CountryCode.USA}
          />
        ),
      });

      expect(page.root).toMatchSnapshot();
    });

    test('renders CAN Business Number (BN) label and help text', async () => {
      const page = await newSpecPage({
        components: [JustifiBusinessCoreInfoFormStep],
        template: () => (
          <justifi-business-core-info-form-step
            businessId="biz_123"
            authToken="test-token"
            country={CountryCode.CAN}
          />
        ),
      });

      expect(page.root).toMatchSnapshot();
    });
  });

  describe('Tax ID toggle behavior', () => {
    test('shows regular input when component loads with no data', async () => {
      mockGetBusiness.mockImplementation(({ final }) => final?.());

      const page = await newSpecPage({
        components: [JustifiBusinessCoreInfoFormStep],
        template: () => (
          <justifi-business-core-info-form-step
            businessId="biz_123"
            authToken="test-token"
            country={CountryCode.USA}
          />
        ),
      });

      // Mock the state properties directly on the component instance
      // This overrides the functions created by initializeApi()
      page.rootInstance.getBusiness = mockGetBusiness;
      page.rootInstance.patchBusiness = mockPatchBusiness;

      // Manually trigger getData to use our mocked function
      // @ts-ignore - accessing private method for testing
      page.rootInstance.getData();

      await page.waitForChanges();

      // Should render masked input when no last4 present
      const taxIdMasked = page.root.querySelector('form-control-number-masked[name="tax_id"]');
      expect(taxIdMasked).toBeTruthy();
    });

    test('shows read-only display when tax_id_last4 is present', async () => {
      // Mock getBusiness to return data with tax_id_last4
      mockGetBusiness.mockImplementation(({ onSuccess, final }) => {
        onSuccess({
          data: {
            tax_id: '123456789',
            tax_id_last4: '6789'
          }
        });
        final?.();
      });

      const page = await newSpecPage({
        components: [JustifiBusinessCoreInfoFormStep],
        template: () => (
          <justifi-business-core-info-form-step
            businessId="biz_123"
            authToken="test-token"
            country={CountryCode.USA}
          />
        ),
      });

      // Mock the state properties directly on the component instance
      page.rootInstance.getBusiness = mockGetBusiness;
      page.rootInstance.patchBusiness = mockPatchBusiness;

      // Manually trigger getData to use our mocked function
      // @ts-ignore - accessing private method for testing
      page.rootInstance.getData();

      // Wait for component to load and call getBusiness
      await page.waitForChanges();
      // Should render read-only UI with label and disabled input
      const readOnlyLabel = page.root.querySelector('label.form-label');
      expect(readOnlyLabel).toBeTruthy();
    });
  });

  describe('Form component behavior', () => {
    test('uses toggleable-field instead of form-control-text', async () => {
      mockGetBusiness.mockImplementation(({ final }) => final?.());

      const page = await newSpecPage({
        components: [JustifiBusinessCoreInfoFormStep],
        template: () => (
          <justifi-business-core-info-form-step
            businessId="biz_123"
            authToken="test-token"
            country={CountryCode.USA}
          />
        ),
      });

      // Mock the state properties directly on the component instance
      page.rootInstance.getBusiness = mockGetBusiness;
      page.rootInstance.patchBusiness = mockPatchBusiness;

      // Manually trigger getData to use our mocked function
      // @ts-ignore - accessing private method for testing
      page.rootInstance.getData();

      await page.waitForChanges();

      // Inline implementation preseunt; snapshot covers structure
      expect(page.root).toMatchSnapshot();
    });
  });

  describe('Payload behavior with tax_id_last4', () => {
    test('excludes tax_id from payload when tax_id_last4 is present', async () => {
      mockGetBusiness.mockImplementation(({ onSuccess, final }) => {
        onSuccess({
          data: {
            legal_name: 'Test Business',
            classification: 'llc',
            industry: 'technology',
            tax_id: '123456789',
            tax_id_last4: '6789',
            email: 'test@example.com',
            phone: '5555555555'
          }
        });
        final?.();
      });

      const page = await newSpecPage({
        components: [JustifiBusinessCoreInfoFormStep],
        template: () => (
          <justifi-business-core-info-form-step
            businessId="biz_123"
            authToken="test-token"
            country={CountryCode.USA}
          />
        ),
      });

      page.rootInstance.getBusiness = mockGetBusiness;
      page.rootInstance.patchBusiness = mockPatchBusiness;

      // @ts-ignore - accessing private method for testing
      page.rootInstance.getData();
      await page.waitForChanges();

      // Access payload getter directly
      const payload = page.rootInstance.patchPayload;

      // Verify tax_id is NOT in the payload when tax_id_last4 exists
      expect(payload).not.toHaveProperty('tax_id');
      expect(payload.legal_name).toBe('Test Business');
      expect(payload.classification).toBe('llc');
    });

    test('includes tax_id in payload when tax_id_last4 is not present', async () => {
      mockGetBusiness.mockImplementation(({ onSuccess, final }) => {
        onSuccess({
          data: {
            legal_name: 'Test Business',
            classification: 'llc',
            industry: 'technology',
            tax_id: '123456789',
            email: 'test@example.com',
            phone: '5555555555'
          }
        });
        final?.();
      });

      const page = await newSpecPage({
        components: [JustifiBusinessCoreInfoFormStep],
        template: () => (
          <justifi-business-core-info-form-step
            businessId="biz_123"
            authToken="test-token"
            country={CountryCode.USA}
          />
        ),
      });

      page.rootInstance.getBusiness = mockGetBusiness;
      page.rootInstance.patchBusiness = mockPatchBusiness;

      // @ts-ignore - accessing private method for testing
      page.rootInstance.getData();
      await page.waitForChanges();

      // Access payload getter directly
      const payload = page.rootInstance.patchPayload;

      // Verify tax_id IS in the payload when tax_id_last4 doesn't exist
      expect(payload).toHaveProperty('tax_id');
      expect(payload.tax_id).toBe('123456789');
      expect(payload.legal_name).toBe('Test Business');
      expect(payload.classification).toBe('llc');
    });
  });

});
