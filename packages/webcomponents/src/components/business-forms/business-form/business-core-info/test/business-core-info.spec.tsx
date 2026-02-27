import { h } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';
import { JustifiBusinessCoreInfo } from '../business-core-info';
import { FormController } from '../../../../../ui-components/form/form';
import { businessCoreInfoSchemaUSA, businessCoreInfoSchemaCAN } from '../../../schemas/business-core-info-schema';
import { CountryCode } from '../../../../../utils/country-codes';

describe('justifi-business-core-info', () => {
  describe('Country-specific tax ID label and help text', () => {
    test('renders USA tax ID label and help text', async () => {
      const formController = new FormController(businessCoreInfoSchemaUSA());
      
      const page = await newSpecPage({
        components: [JustifiBusinessCoreInfo],
        template: () => (
          <justifi-business-core-info
            formController={formController}
            country={CountryCode.USA}
          />
        ),
      });
      
      expect(page.root).toMatchSnapshot();
    });

    test('renders CAN Business Number (BN) label and help text', async () => {
      const formController = new FormController(businessCoreInfoSchemaCAN());
      
      const page = await newSpecPage({
        components: [JustifiBusinessCoreInfo],
        template: () => (
          <justifi-business-core-info
            formController={formController}
            country={CountryCode.CAN}
          />
        ),
      });
      
      expect(page.root).toMatchSnapshot();
      
      // Inline implementation: ensure label/help text present via snapshot
    });
  });

  describe('Form component behavior', () => {
    test('uses toggleable-field instead of form-control-text', async () => {
      const formController = new FormController(businessCoreInfoSchemaUSA());
      
      const page = await newSpecPage({
        components: [JustifiBusinessCoreInfo],
        template: () => (
          <justifi-business-core-info
            formController={formController}
            country={CountryCode.USA}
          />
        ),
      });
      
      // Inline implementation present; snapshot covers structure
      expect(page.root).toMatchSnapshot();
    });
  });

  describe('Tax ID toggle behavior', () => {
    test('shows regular input when no tax_id_last4 is present', async () => {
      const formController = new FormController(businessCoreInfoSchemaUSA());
      // Mock form controller with no tax_id_last4
      formController.setInitialValues({ tax_id: '', tax_id_last4: null });
      
      const page = await newSpecPage({
        components: [JustifiBusinessCoreInfo],
        template: () => (
          <justifi-business-core-info
            formController={formController}
            country={CountryCode.USA}
          />
        ),
      });
      
      // Should render masked input when no last4 present
      const taxIdMasked = page.root.querySelector('form-control-number-masked[name="tax_id"]');
      expect(taxIdMasked).toBeTruthy();
    });

    test('shows read-only display when tax_id_last4 is present', async () => {
      const formController = new FormController(businessCoreInfoSchemaUSA());
      // Mock form controller with tax_id_last4
      formController.setInitialValues({ tax_id: '123456789', tax_id_last4: '6789' });
      
      const page = await newSpecPage({
        components: [JustifiBusinessCoreInfo],
        template: () => (
          <justifi-business-core-info
            formController={formController}
            country={CountryCode.USA}
          />
        ),
      });
      
      // Let component load and set state
      await page.waitForChanges();
      
      // Should render read-only UI with label and disabled input
      const readOnlyLabel = page.root.querySelector('label.form-label');
      expect(readOnlyLabel).toBeTruthy();
    });
  });
});
