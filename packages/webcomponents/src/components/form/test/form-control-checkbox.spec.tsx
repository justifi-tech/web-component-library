import { h } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';
import { CheckboxInput } from '../form-control-checkbox';
import { FormControlErrorText } from '../form-helpers/form-control-error-text/form-control-error-text';
import { FormControlHelpText } from '../form-helpers/form-control-help-text/form-control-help-text';

describe('form-control-checkbox', () => {
  const components = [CheckboxInput, FormControlErrorText, FormControlHelpText];
  const mockInputHandler = jest.fn();

  it('Renders with default props', async () => {
    const page = await newSpecPage({
      components: components,
      template: () => <form-control-checkbox label='Accept Terms' name='accept' />,
    });

    expect(page.root).toMatchSnapshot();
  });

  it('Renders with all props provided', async () => {
    const page = await newSpecPage({
      components: components,
      template: () =>
        <form-control-checkbox
          label='Accept Terms'
          name='accept'
          helpText='Accept terms and conditions to continue'
          errorText='You must accept the terms and conditions to continue'
          disabled
          inputHandler={mockInputHandler}
        >
        </form-control-checkbox>
    });

    expect(page.root).toMatchSnapshot();
  });

  it('Handles user input correctly', async () => {
    const page = await newSpecPage({
      components: components,
      template: () =>
        <form-control-checkbox
          label='Accept Terms'
          name='accept'
          inputHandler={mockInputHandler}
        >
        </form-control-checkbox>
    });

    const inputElement = page.root.querySelector('input');
    const testValue = true;

    inputElement.checked = testValue;
    await inputElement.dispatchEvent(new Event('input'));

    expect(inputElement.checked).toBe(testValue);
  });

  it('Emits formControlInput event on input', async () => {
    const page = await newSpecPage({
      components: components,
      template: () =>
        <form-control-checkbox
          label='Accept Terms'
          name='accept'
          inputHandler={mockInputHandler}
        >
        </form-control-checkbox>
    });

    const inputEventSpy = jest.fn();
    page.root.addEventListener('formControlInput', inputEventSpy);
    const inputElement = page.root.querySelector('input');
    inputElement.value = "true";

    inputElement.dispatchEvent(new Event('input', { bubbles: true, composed: true }));

    expect(inputEventSpy).toHaveBeenCalledWith(expect.objectContaining({
      detail: expect.objectContaining({
        name: 'accept',
        value: "true",
      }),
    }));
  });

  it('Emits formControlBlur event on blur', async () => {
    const page = await newSpecPage({
      components: components,
      template: () =>
        <form-control-checkbox
          label='Accept Terms'
          name='accept'
          inputHandler={mockInputHandler}
        >
        </form-control-checkbox>
    });

    const blurEventSpy = jest.fn();
    page.root.addEventListener('formControlBlur', blurEventSpy);

    const inputElement = page.root.querySelector('input');
    await inputElement.dispatchEvent(new CustomEvent('blur'));
    expect(blurEventSpy).toHaveBeenCalled();
  });

  it('Disables input when disabled prop is provided', async () => {
    const page = await newSpecPage({
      components: components,
      template: () =>
        <form-control-checkbox
          label='Accept Terms'
          name='accept'
          inputHandler={mockInputHandler}
          disabled
        >
        </form-control-checkbox>
    });

    const inputElement = page.root.querySelector('input');
    expect(inputElement).toHaveAttribute('disabled');
  });

  it('Shows help text when helpText prop is provided', async () => {
    const page = await newSpecPage({
      components: components,
      template: () =>
        <form-control-checkbox
          label='Accept Terms'
          name='accept'
          helpText='Accept terms and conditions to continue'
          inputHandler={mockInputHandler}
        >
        </form-control-checkbox>
    });

    const helpTextComponent = page.root.querySelector('form-control-help-text');
    expect(helpTextComponent).not.toBeNull();

    const helpText = helpTextComponent.querySelector('.text-muted');
    expect(helpText.textContent).toBe('Accept terms and conditions to continue');
  });

  it('Shows error and applies error styling when error prop is provided', async () => {
    const page = await newSpecPage({
      components: components,
      template: () =>
        <form-control-checkbox
          label='Accept Terms'
          name='accept'
          errorText='You must accept the terms and conditions to continue'
          inputHandler={mockInputHandler}
        >
        </form-control-checkbox>
    });

    const errorTextComponent = page.root.querySelector('form-control-error-text');
    expect(errorTextComponent).not.toBeNull();

    const errorText = errorTextComponent.querySelector('.text-danger');
    expect(errorText.textContent).toBe('You must accept the terms and conditions to continue');

    const inputElement = page.root.querySelector('input');
    expect(inputElement.classList.contains('is-invalid')).toBe(true);
  });
});
