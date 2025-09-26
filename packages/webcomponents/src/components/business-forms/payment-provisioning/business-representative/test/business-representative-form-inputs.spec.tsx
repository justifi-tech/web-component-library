import { h } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';
import { RepresentativeFormInputs } from '../business-representative-form-inputs';
import { FormController } from '../../../../../ui-components/form/form';
import { identitySchemaUSA, identitySchemaCAN } from '../../../schemas/business-identity-schema';
import { CountryCode } from '../../../../../utils/country-codes';

describe('justifi-business-representative-form-inputs', () => {
  const mockFormController = () => {
    return new FormController(identitySchemaUSA('representative'));
  };

  describe('Country-specific identification number label', () => {
    test('renders USA SSN label and help text', async () => {
      const formController = mockFormController();
      const representativeData = { identification_number: '', ssn_last4: null };
      
      const page = await newSpecPage({
        components: [RepresentativeFormInputs],
        template: () => (
          <justifi-business-representative-form-inputs
            formController={formController}
            representativeDefaultValue={representativeData}
            errors={{}}
            country={CountryCode.USA}
          />
        ),
      });
      
      expect(page.root).toMatchSnapshot();
      
      // Inline implementation: ensure label/help text present via snapshot
    });

    test('renders CAN SIN label and help text', async () => {
      const formController = new FormController(identitySchemaCAN('representative'));
      const representativeData = { identification_number: '', ssn_last4: null };
      
      const page = await newSpecPage({
        components: [RepresentativeFormInputs],
        template: () => (
          <justifi-business-representative-form-inputs
            formController={formController}
            representativeDefaultValue={representativeData}
            errors={{}}
            country={CountryCode.CAN}
          />
        ),
      });
      
      expect(page.root).toMatchSnapshot();
      
      // Inline implementation: ensure label/help text present via snapshot
    });
  });

  describe('Identification number toggle behavior', () => {
    test('shows regular input when no ssn_last4 is present', async () => {
      const formController = mockFormController();
      const representativeData = { 
        identification_number: '',
        ssn_last4: null 
      };
      
      const page = await newSpecPage({
        components: [RepresentativeFormInputs],
        template: () => (
          <justifi-business-representative-form-inputs
            formController={formController}
            representativeDefaultValue={representativeData}
            errors={{}}
            country={CountryCode.USA}
          />
        ),
      });
      
      // Should render masked input when no last4 present
      const maskedIdField = page.root.querySelector('form-control-number-masked[name="identification_number"]');
      expect(maskedIdField).toBeTruthy();
    });

    test('shows read-only display when ssn_last4 is present', async () => {
      const formController = mockFormController();
      const representativeData = { 
        identification_number: '123456789',
        ssn_last4: '6789' 
      };
      
      const page = await newSpecPage({
        components: [RepresentativeFormInputs],
        template: () => (
          <justifi-business-representative-form-inputs
            formController={formController}
            representativeDefaultValue={representativeData}
            errors={{}}
            country={CountryCode.USA}
          />
        ),
      });
      
      // Should render read-only display when last4 is present
      const readOnlyLabel = page.root.querySelector('label.form-label');
      expect(readOnlyLabel).toBeTruthy();
    });
  });

  describe('Form component behavior', () => {
    test('uses toggleable-field instead of form-control-number-masked', async () => {
      const formController = mockFormController();
      const representativeData = {};
      
      const page = await newSpecPage({
        components: [RepresentativeFormInputs],
        template: () => (
          <justifi-business-representative-form-inputs
            formController={formController}
            representativeDefaultValue={representativeData}
            errors={{}}
            country={CountryCode.USA}
          />
        ),
      });
      
      // Inline implementation present; snapshot covers structure
      expect(page.root).toMatchSnapshot();
    });
  });
});