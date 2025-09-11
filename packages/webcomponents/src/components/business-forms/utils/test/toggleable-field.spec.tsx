import { h } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';
import { ToggleableField } from '../toggleable-field';

describe('toggleable-field', () => {
  const mockInputHandler = jest.fn();

  beforeEach(() => {
    mockInputHandler.mockClear();
  });

  describe('when no readOnlyValue is provided', () => {
    it('should render as regular input field', async () => {
      const page = await newSpecPage({
        components: [ToggleableField],
        template: () => (
          <toggleable-field
            fieldName="test_field"
            label="Test Field"
            inputHandler={mockInputHandler}
            defaultValue="initial value"
            helpText="Help text"
          />
        ),
      });

      expect(page.root).toMatchSnapshot();

      // Should render form-control-number-masked directly
      const inputField = page.root.querySelector('form-control-number-masked');
      expect(inputField).toBeTruthy();
      expect(inputField.getAttribute('name')).toBe('test_field');
      expect(inputField.getAttribute('label')).toBe('Test Field');
      expect(inputField.getAttribute('defaultvalue')).toBe('initial value');
      expect(inputField.getAttribute('helptext')).toBe('Help text');

      // Should not show read-only display
      const readOnlyDisplay = page.root.querySelector('input[disabled=""]');
      expect(readOnlyDisplay).toBeNull();

      // Should not show Update button
      const updateButton = page.root.querySelector('button');
      expect(updateButton).toBeNull();
    });

    it('should render with mask when provided', async () => {
      const page = await newSpecPage({
        components: [ToggleableField],
        template: () => (
          <toggleable-field
            fieldName="ssn"
            label="SSN"
            inputHandler={mockInputHandler}
            mask="999-99-9999"
          />
        ),
      });

      const inputField = page.root.querySelector('form-control-number-masked');
      expect(inputField).toBeTruthy();
      expect(inputField.getAttribute('mask')).toBe('999-99-9999');
    });
  });

  describe('when readOnlyValue is provided', () => {
    it('should render read-only display with Change button', async () => {
      const page = await newSpecPage({
        components: [ToggleableField],
        template: () => (
          <toggleable-field
            fieldName="tax_id"
            label="Tax ID"
            readOnlyValue="1234"
            inputHandler={mockInputHandler}
          />
        ),
      });

      expect(page.root).toMatchSnapshot();

      // Should show label
      const label = page.root.querySelector('label');
      expect(label).toBeTruthy();
      expect(label.textContent).toBe('Tax ID');

      // Should show masked value
      const valueDisplay = page.root.querySelector('input');
      expect(valueDisplay).toBeTruthy();
      expect(valueDisplay.value).toBe('****1234');

      // Should show Update button
      const updateButton = page.root.querySelector('button');
      expect(updateButton).toBeTruthy();
      expect(updateButton.textContent.trim()).toBe('Change');
      expect(updateButton.type).toBe('button');

      // Should not show input field initially
      const inputField = page.root.querySelector('form-control-number-masked');
      expect(inputField).toBeNull();
    });

    it('should not show help text in read-only mode', async () => {
      const page = await newSpecPage({
        components: [ToggleableField],
        template: () => (
          <toggleable-field
            fieldName="tax_id"
            label="Tax ID"
            readOnlyValue="1234"
            inputHandler={mockInputHandler}
            helpText="This should not show in read-only mode"
          />
        ),
      });

      // Should not show help text div
      const helpTextDiv = page.root.querySelector('.form-text');
      expect(helpTextDiv).toBeNull();
    });

    it('should toggle to edit mode when Update button is clicked', async () => {
      const page = await newSpecPage({
        components: [ToggleableField],
        template: () => (
          <toggleable-field
            fieldName="ssn"
            label="SSN"
            readOnlyValue="5678"
            inputHandler={mockInputHandler}
            mask="999-99-9999"
            helpText="Help text should show in edit mode"
          />
        ),
      });

      // Initially in read-only mode
      expect(page.root.querySelector('input[disabled=""]')).toBeTruthy();
      expect(page.root.querySelector('form-control-number-masked')).toBeNull();

      // Click Update button
      const updateButton = page.root.querySelector('button');
      updateButton.click();
      await page.waitForChanges();

      // Should now show input field
      const inputField = page.root.querySelector('form-control-number-masked');
      expect(inputField).toBeTruthy();
      expect(inputField.getAttribute('name')).toBe('ssn');
      expect(inputField.getAttribute('label')).toBe('SSN');
      expect(inputField.getAttribute('defaultvalue')).toBe(''); // Should be empty in edit mode
      expect(inputField.getAttribute('mask')).toBe('999-99-9999');
      expect(inputField.getAttribute('helptext')).toBe('Help text should show in edit mode');

      // Should not show read-only display anymore
      expect(page.root.querySelector('input[disabled=""]')).toBeNull();
      expect(page.root.querySelector('button')).toBeNull();
    });

    it('should handle empty readOnlyValue (falsy values)', async () => {
      const testCases = [null, undefined, ''];
      
      for (const readOnlyValue of testCases) {
        const page = await newSpecPage({
          components: [ToggleableField],
          template: () => (
            <toggleable-field
              fieldName="test_field"
              label="Test Field"
              readOnlyValue={readOnlyValue}
              inputHandler={mockInputHandler}
            />
          ),
        });

        // Should render as regular input field (not read-only)
        const inputField = page.root.querySelector('form-control-number-masked');
        expect(inputField).toBeTruthy();

        // Should not show read-only display
        const readOnlyDisplay = page.root.querySelector('input[disabled=""]');
        expect(readOnlyDisplay).toBeNull();
      }
    });
  });

  describe('error handling', () => {
    it('should pass through error text to input field', async () => {
      const page = await newSpecPage({
        components: [ToggleableField],
        template: () => (
          <toggleable-field
            fieldName="tax_id"
            label="Tax ID"
            inputHandler={mockInputHandler}
            errorText="This field is required"
          />
        ),
      });

      const inputField = page.root.querySelector('form-control-number-masked');
      expect(inputField.getAttribute('errortext')).toBe('This field is required');
    });
  });
});