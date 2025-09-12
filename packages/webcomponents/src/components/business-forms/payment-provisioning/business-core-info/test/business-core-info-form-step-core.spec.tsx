import { h } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';
import { BusinessCoreInfoFormStepCore } from '../business-core-info-form-step-core';
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
        components: [BusinessCoreInfoFormStepCore],
        template: () => (
          <justifi-business-core-info-form-step-core
            businessId="biz_123"
            getBusiness={mockGetBusiness}
            patchBusiness={mockPatchBusiness}
            country={CountryCode.USA}
          />
        ),
      });
      
      expect(page.root).toMatchSnapshot();
    });

    test('renders CAN Business Number (BN) label and help text', async () => {
      const page = await newSpecPage({
        components: [BusinessCoreInfoFormStepCore],
        template: () => (
          <justifi-business-core-info-form-step-core
            businessId="biz_123"
            getBusiness={mockGetBusiness}
            patchBusiness={mockPatchBusiness}
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
        components: [BusinessCoreInfoFormStepCore],
        template: () => (
          <justifi-business-core-info-form-step-core
            businessId="biz_123"
            getBusiness={mockGetBusiness}
            patchBusiness={mockPatchBusiness}
            country={CountryCode.USA}
          />
        ),
      });
      
      const taxIdField = page.root.querySelector('toggleable-field[fieldname="tax_id"]');
      expect(taxIdField).toBeTruthy();
      // When no data is loaded, readOnlyValue should be null/undefined
      expect(taxIdField.getAttribute('readonlyvalue')).toBe(null);
      expect(taxIdField.getAttribute('maxlength')).toBe('9');
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
        components: [BusinessCoreInfoFormStepCore],
        template: () => (
          <justifi-business-core-info-form-step-core
            businessId="biz_123"
            getBusiness={mockGetBusiness}
            patchBusiness={mockPatchBusiness}
            country={CountryCode.USA}
          />
        ),
      });
      
      // Wait for component to load and call getBusiness
      await page.waitForChanges();
      const taxIdField = page.root.querySelector('toggleable-field[fieldname="tax_id"]');
      expect(taxIdField).toBeTruthy();
      expect(taxIdField.getAttribute('readonlyvalue')).toBe('6789');
    });
  });

  describe('Form component behavior', () => {
    test('uses toggleable-field instead of form-control-text', async () => {
      mockGetBusiness.mockImplementation(({ final }) => final?.());

      const page = await newSpecPage({
        components: [BusinessCoreInfoFormStepCore],
        template: () => (
          <justifi-business-core-info-form-step-core
            businessId="biz_123"
            getBusiness={mockGetBusiness}
            patchBusiness={mockPatchBusiness}
            country={CountryCode.USA}
          />
        ),
      });
      
      const taxIdField = page.root.querySelector('toggleable-field[fieldname="tax_id"]');
      expect(taxIdField).toBeTruthy();
      
      // Should not find the old form-control-text
      const textTaxIdField = page.root.querySelector('form-control-text[name="tax_id"]');
      expect(textTaxIdField).toBeNull();
    });
  });

  describe('Data loading behavior', () => {
    test('calls getBusiness on component load when provided', async () => {
      await newSpecPage({
        components: [BusinessCoreInfoFormStepCore],
        template: () => (
          <justifi-business-core-info-form-step-core
            businessId="biz_123"
            getBusiness={mockGetBusiness}
            patchBusiness={mockPatchBusiness}
            country={CountryCode.USA}
          />
        ),
      });
      
      expect(mockGetBusiness).toHaveBeenCalledTimes(1);
    });
  });
});