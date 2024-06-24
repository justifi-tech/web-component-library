import { newSpecPage } from '@stencil/core/testing';
import { TextInput } from '../form-control-text';
import { FormHelpText } from '../form-helpers/form-help-text/form-help-text';

describe('form-control-text', () => {

  // Test 1: Initial Rendering and Props
  it('renders with default props', async () => {
    const page = await newSpecPage({
      components: [TextInput],
      html: `<form-control-text label="Username" name="username"></form-control-text>`,
    });

    expect(page.root).toMatchSnapshot();
    expect(page.rootInstance.label).toBe('Username');
    expect(page.rootInstance.name).toBe('username');
  });

  // Test 2: Rendering with all props
  it('renders with all props provided', async () => {
    const page = await newSpecPage({
      components: [TextInput],
      html: `
        <form-control-text
          label="Email"
          name="email"
          default-value="user@example.com"
          error="Invalid email"
          disabled
        ></form-control-text>
      `,
    });

    const inputElement = page.root.querySelector('input');
    expect(page.rootInstance.label).toBe('Email');
    expect(inputElement.value).toBe('user@example.com');
    expect(inputElement.disabled).toBeTruthy();
  });

  // Test 3: Handle Default Value Changes
  it('updates input value on defaultValue prop change', async () => {
    const page = await newSpecPage({
      components: [TextInput],
      html: `<form-control-text default-value="initial"></form-control-text>`,
    });

    page.rootInstance.defaultValue = 'updated';
    await page.waitForChanges();

    const inputElement = page.root.querySelector('input');
    expect(inputElement.value).toBe('updated');
  });

  // Test 4: User Interaction - Input
  it('handles user input correctly', async () => {
    const page = await newSpecPage({
      components: [TextInput],
      html: `<form-control-text></form-control-text>`,
    });

    const inputElement = page.root.querySelector('input');
    const testValue = 'Hello, World!';

    inputElement.value = testValue;
    await inputElement.dispatchEvent(new Event('input'));

    expect(inputElement.value).toBe(testValue);
  });

  // Test 5: Event Emission on Input
  it('emits formControlInput event on input', async () => {
    const page = await newSpecPage({
      components: [TextInput],
      html: `<form-control-text></form-control-text>`,
    });

    // Set a mock inputHandler to prevent it from being undefined
    page.rootInstance.inputHandler = jest.fn();

    const inputEventSpy = jest.fn();
    page.root.addEventListener('formControlInput', inputEventSpy);

    await page.waitForChanges();

    const inputElement = page.root.querySelector('input');
    inputElement.value = 'Hello, World!';

    inputElement.dispatchEvent(new Event('input', { bubbles: true, composed: true }));

    await page.waitForChanges();

    expect(inputEventSpy).toHaveBeenCalled();
  });

  // Test 6: Event Emission on Blur
  it('emits formControlBlur event on blur', async () => {
    const page = await newSpecPage({
      components: [TextInput],
      html: `<form-control-text></form-control-text>`,
    });

    const blurEventSpy = jest.fn();
    page.win.addEventListener('formControlBlur', blurEventSpy);

    const inputElement = page.root.querySelector('input');
    inputElement.dispatchEvent(new Event('blur'));

    expect(blurEventSpy).toHaveBeenCalled();
  });

  // Test 7: Disabled Prop
  it('disables input when disabled prop is true', async () => {
    const page = await newSpecPage({
      components: [TextInput],
      html: `<form-control-text disabled></form-control-text>`,
    });

    const inputElement = page.root.querySelector('input');
    expect(inputElement.disabled).toBeTruthy();
  });

  // Test 8: Error Prop
  it('shows error and applies error styling when error prop is provided', async () => {
    const page = await newSpecPage({
      components: [TextInput, FormHelpText],
      html: `<form-control-text error-text="This field is required."></form-control-text>`,
    });

    const helpTextComponent = page.root.querySelector('form-help-text');
    expect(helpTextComponent).not.toBeNull();

    const errorText = helpTextComponent.querySelector('.text-danger');
    expect(errorText.textContent).toBe('This field is required.');
  });
});

