import { h } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';
import { BusinessCoreInfo } from '../business-core-info';
import { FormController } from '../../../../../ui-components/form/form';
import { businessCoreInfoSchemaUSA, businessCoreInfoSchemaCAN } from '../../../schemas/business-core-info-schema';
import { CountryCode } from '../../../../../utils/country-codes';

describe('justifi-business-core-info', () => {
  describe('Country-specific tax ID label and help text', () => {
    test('renders USA tax ID label and help text', async () => {
      const formController = new FormController(businessCoreInfoSchemaUSA());
      
      const page = await newSpecPage({
        components: [BusinessCoreInfo],
        template: () => (
          <justifi-business-core-info
            formController={formController}
            country={CountryCode.USA}
          />
        ),
      });
      
      expect(page.root).toMatchSnapshot();
      
      // Verify the tax ID field uses toggleable-field with correct USA-specific label and help text
      const taxIdField = page.root.querySelector('toggleable-field[fieldname="tax_id"]');
      expect(taxIdField).toBeTruthy();
      expect(taxIdField.getAttribute('label')).toBe('Tax ID (EIN or SSN)');
      expect(taxIdField.getAttribute('helptext')).toBe('Employer Identification Numbers (EINs) are nine digits. The federal tax identification number/EIN issued to you by the IRS. It can be found on your tax returns. Enter value without dashes.');
    });

    test('renders CAN Business Number (BN) label and help text', async () => {
      const formController = new FormController(businessCoreInfoSchemaCAN());
      
      const page = await newSpecPage({
        components: [BusinessCoreInfo],
        template: () => (
          <justifi-business-core-info
            formController={formController}
            country={CountryCode.CAN}
          />
        ),
      });
      
      expect(page.root).toMatchSnapshot();
      
      // Verify the tax ID field uses toggleable-field with correct Canada-specific label and help text
      const taxIdField = page.root.querySelector('toggleable-field[fieldname="tax_id"]');
      expect(taxIdField).toBeTruthy();
      expect(taxIdField.getAttribute('label')).toBe('Business Number (BN)');
      expect(taxIdField.getAttribute('helptext')).toBe('Business Numbers (BN) are nine digits. Enter value without spaces or dashes.');
    });
  });

  describe('Form component behavior', () => {
    test('uses toggleable-field instead of form-control-text', async () => {
      const formController = new FormController(businessCoreInfoSchemaUSA());
      
      const page = await newSpecPage({
        components: [BusinessCoreInfo],
        template: () => (
          <justifi-business-core-info
            formController={formController}
            country={CountryCode.USA}
          />
        ),
      });
      
      const taxIdField = page.root.querySelector('toggleable-field[fieldname="tax_id"]');
      expect(taxIdField).toBeTruthy();
      expect(taxIdField.getAttribute('maxlength')).toBe('9');
      
      // Should not find the old form-control-text
      const textTaxIdField = page.root.querySelector('form-control-text[name="tax_id"]');
      expect(textTaxIdField).toBeNull();
    });
  });

  describe('Tax ID toggle behavior', () => {
    test('shows regular input when no tax_id_last4 is present', async () => {
      const formController = new FormController(businessCoreInfoSchemaUSA());
      // Mock form controller with no tax_id_last4
      formController.setInitialValues({ tax_id: '', tax_id_last4: null });
      
      const page = await newSpecPage({
        components: [BusinessCoreInfo],
        template: () => (
          <justifi-business-core-info
            formController={formController}
            country={CountryCode.USA}
          />
        ),
      });
      
      const taxIdField = page.root.querySelector('toggleable-field[fieldname="tax_id"]');
      expect(taxIdField).toBeTruthy();
      expect(taxIdField.getAttribute('readonlyvalue')).toBe(null);
    });

    test('shows read-only display when tax_id_last4 is present', async () => {
      const formController = new FormController(businessCoreInfoSchemaUSA());
      // Mock form controller with tax_id_last4
      formController.setInitialValues({ tax_id: '123456789', tax_id_last4: '6789' });
      
      const page = await newSpecPage({
        components: [BusinessCoreInfo],
        template: () => (
          <justifi-business-core-info
            formController={formController}
            country={CountryCode.USA}
          />
        ),
      });
      
      // Let component load and set state
      await page.waitForChanges();
      
      const taxIdField = page.root.querySelector('toggleable-field[fieldname="tax_id"]');
      expect(taxIdField).toBeTruthy();
      expect(taxIdField.getAttribute('readonlyvalue')).toBe('6789');
    });
  });
});
