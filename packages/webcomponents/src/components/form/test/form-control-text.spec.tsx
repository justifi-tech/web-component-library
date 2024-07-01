import { h } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';
import { TextInput } from '../form-control-text';
import { FormControlErrorText } from '../form-helpers/form-control-error-text/form-control-error-text';
import { FormControlHelpText } from '../form-helpers/form-control-help-text/form-control-help-text';

describe('form-control-text', () => {
  const components = [TextInput, FormControlErrorText, FormControlHelpText];
  const mockInputHandler = jest.fn();
  const mockKeyDownHandler = jest.fn();

  it('Renders with default props', async () => {
    const page = await newSpecPage({
      components: components,
      template: () => <form-control-text label='Username' name='username'></form-control-text>,
    });

    expect(page.root).toMatchSnapshot();
    expect(page.rootInstance.label).toBe('Username');
    expect(page.rootInstance.name).toBe('username');
  });

  it('Renders with all props provided', async () => {
    const page = await newSpecPage({
      components: components,
      template: () =>
        <form-control-text
          label='Email'
          name='email'
          defaultValue='user@example.com'
          errorText='Invalid email'
          helpText='Enter your email'
          disabled
          maxLength={50}
          inputHandler={mockInputHandler}
          keyDownHandler={mockKeyDownHandler}
        >
        </form-control-text>
    });

    expect(page.root).toMatchSnapshot();
  });

  it('Updates input value on defaultValue prop change', async () => {
    // Initial render with the default value
    let defaultValue = 'user@example.com';
    let page = await newSpecPage({
      components: components,
      template: () =>
        <form-control-text
          label='Email'
          name='email'
          defaultValue={defaultValue}
        >
        </form-control-text>
    });

    let inputElement = page.root.querySelector('input');
    expect(inputElement.value).toBe('user@example.com');

    defaultValue = 'updated@example.com';

    // Re-render component with new defaultValue
    page = await newSpecPage({
      components: components,
      template: () =>
        <form-control-text
          label='Email'
          name='email'
          defaultValue={defaultValue}
        >
        </form-control-text>
    });

    inputElement = page.root.querySelector('input');
    expect(inputElement.value).toBe('updated@example.com');
  });

  it('Handles user input correctly', async () => {
    const page = await newSpecPage({
      components: components,
      template: () =>
        <form-control-text
          label='Email'
          name='email'
          defaultValue='user@example.com'
          inputHandler={mockInputHandler}
        >
        </form-control-text>
    });

    const inputElement = page.root.querySelector('input');
    const testValue = 'Hello, World!';

    inputElement.value = testValue;
    await inputElement.dispatchEvent(new Event('input'));

    expect(inputElement.value).toBe(testValue);
  });

  it('Emits formControlInput event on input', async () => {
    const page = await newSpecPage({
      components: components,
      template: () =>
        <form-control-text
          label='Email'
          name='email'
          defaultValue='user@example.com'
          inputHandler={mockInputHandler}
        >
        </form-control-text>
    });

    const inputEventSpy = jest.fn();
    page.root.addEventListener('formControlInput', inputEventSpy);

    await page.waitForChanges();

    const inputElement = page.root.querySelector('input');
    inputElement.value = 'Hello, World!';

    inputElement.dispatchEvent(new Event('input', { bubbles: true, composed: true }));

    await page.waitForChanges();

    expect(inputEventSpy).toHaveBeenCalled();
  });

  it('Emits formControlBlur event on blur', async () => {
    const page = await newSpecPage({
      components: components,
      template: () => <form-control-text defaultValue='user@example.com' inputHandler={mockInputHandler}></form-control-text>
    });

    const blurEventSpy = jest.fn();
    page.root.addEventListener('formControlBlur', blurEventSpy);

    const inputElement = page.root.querySelector('input');
    inputElement.dispatchEvent(new Event('blur'));

    expect(blurEventSpy).toHaveBeenCalled();
  });

  it('Disables input when disabled prop is provided', async () => {
    const page = await newSpecPage({
      components: components,
      template: () => <form-control-text label='Username' name='username' disabled></form-control-text>,
    });

    const inputElement = page.root.querySelector('input');
    expect(inputElement.disabled).toBeTruthy();
  });

  it('Shows help text when helpText prop is provided', async () => {
    const page = await newSpecPage({
      components: components,
      template: () => <form-control-text label='Username' name='username' helpText='This is the help text.'></form-control-text>,
    });

    const helpTextComponent = page.root.querySelector('form-control-help-text');
    expect(helpTextComponent).not.toBeNull();

    const helpText = helpTextComponent.querySelector('.text-muted');
    expect(helpText.textContent).toBe('This is the help text.');
  });

  it('Shows error and applies error styling when error prop is provided', async () => {
    const page = await newSpecPage({
      components: components,
      template: () => <form-control-text label='Username' name='username' errorText='This field is required.'></form-control-text>,
    });

    const errorTextComponent = page.root.querySelector('form-control-error-text');
    expect(errorTextComponent).not.toBeNull();

    const errorText = errorTextComponent.querySelector('.text-danger');
    expect(errorText.textContent).toBe('This field is required.');
  });
});
