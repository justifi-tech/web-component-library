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
      
      // Verify the identification number field uses toggleable-field with correct USA-specific label and help text
      const idField = page.root.querySelector('toggleable-field[fieldname="identification_number"]');
      expect(idField).toBeTruthy();
      expect(idField.getAttribute('label')).toBe('SSN');
      expect(idField.getAttribute('helptext')).toBe('Enter your full Social Security Number. It is required for Federal OFAC check.');
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
      
      // Verify the identification number field uses toggleable-field with correct Canada-specific label and help text
      const idField = page.root.querySelector('toggleable-field[fieldname="identification_number"]');
      expect(idField).toBeTruthy();
      expect(idField.getAttribute('label')).toBe('SIN');
      expect(idField.getAttribute('helptext')).toBe('Enter your full Social Insurance Number.');
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
      
      const idField = page.root.querySelector('toggleable-field[fieldname="identification_number"]');
      expect(idField).toBeTruthy();
      expect(idField.getAttribute('readonlyvalue')).toBe(null);
      expect(idField.getAttribute('mask')).toBe('000-00-0000');
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
      
      const idField = page.root.querySelector('toggleable-field[fieldname="identification_number"]');
      expect(idField).toBeTruthy();
      expect(idField.getAttribute('readonlyvalue')).toBe('6789');
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
      
      const idField = page.root.querySelector('toggleable-field[fieldname="identification_number"]');
      expect(idField).toBeTruthy();
      
      // Should not find the old masked input
      const maskedIdField = page.root.querySelector('form-control-number-masked[name="identification_number"]');
      expect(maskedIdField).toBeNull();
    });
  });
});