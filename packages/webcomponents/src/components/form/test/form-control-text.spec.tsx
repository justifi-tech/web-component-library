import { h } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';
import { TextInput } from '../form-control-text';
import { FormControlErrorText } from '../form-helpers/form-control-error-text/form-control-error-text';
import { TooltipComponent } from '../form-helpers/form-control-tooltip/form-control-tooltip';

describe('form-control-text', () => {
  const components = [TextInput, FormControlErrorText, TooltipComponent];
  const mockInputHandler = jest.fn();
  const mockKeyDownHandler = jest.fn();

  it('Renders with default props', async () => {
    const page = await newSpecPage({
      components: components,
      template: () => <form-control-text label='Username' name='username'/>,
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
        />
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
        />
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
        />
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
        />
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
        />
    });

    const inputEventSpy = jest.fn();
    page.root.addEventListener('formControlInput', inputEventSpy);

    await page.waitForChanges();

    const inputElement = page.root.querySelector('input');
    inputElement.value = 'other-user@example.com';

    inputElement.dispatchEvent(new Event('input', { bubbles: true, composed: true }));

    await page.waitForChanges();

    expect(inputEventSpy).toHaveBeenCalledWith(expect.objectContaining({
      detail: {
        name: 'email',
        value: 'other-user@example.com'
      }
    }));
  });

  it('Emits formControlBlur event on blur', async () => {
    const page = await newSpecPage({
      components: components,
      template: () => <form-control-text defaultValue='user@example.com' inputHandler={mockInputHandler}/>
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
      template: () => <form-control-text label='Username' name='username' disabled/>,
    });

    const inputElement = page.root.querySelector('input');
    expect(inputElement.disabled).toBeTruthy();
  });

  it('Shows help text when helpText prop is provided', async () => {
    const page = await newSpecPage({
      components: components,
      template: () => <form-control-text label='Username' name='username' helpText='This is the help text.'/>,
    });

    const tooltipComponent = page.root.querySelector('form-control-tooltip');
    expect(tooltipComponent).not.toBeNull();

    const tooltipIcon = tooltipComponent.querySelector('.bi-question-square');
    expect(tooltipIcon).not.toBeNull();

    const tooltipElement = tooltipComponent.querySelector('.tooltip');
    expect(tooltipElement).not.toBeNull();

    const tooltipText = tooltipElement.querySelector('.tooltip-inner');
    expect(tooltipText.textContent).toBe('This is the help text.');
  });

  it('Shows error and applies error styling when error prop is provided', async () => {
    const page = await newSpecPage({
      components: components,
      template: () => <form-control-text label='Username' name='username' errorText='This field is required.'/>,
    });

    const errorTextComponent = page.root.querySelector('form-control-error-text');
    expect(errorTextComponent).not.toBeNull();

    const errorText = errorTextComponent.querySelector('.text-danger');
    expect(errorText.textContent).toBe('This field is required.');

    const inputElement = page.root.querySelector('input');
    expect(inputElement.classList.contains('is-invalid')).toBe(true);
  });
});
