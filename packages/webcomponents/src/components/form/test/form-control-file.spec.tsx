import { newSpecPage } from '@stencil/core/testing';
import { FileInput } from '../form-control-file';
import { FormHelpText } from '../form-helpers/form-help-text/form-help-text';

describe('form-control-file', () => {

  it('renders with default props', async () => {
    const page = await newSpecPage({
      components: [FileInput],
      html: `<form-control-file label="Select a file" name="user ID"></form-control-file>`,
    });

    expect(page.root).toMatchSnapshot();
    expect(page.rootInstance.label).toBe('Select a file');
    expect(page.rootInstance.name).toBe('user ID');
  });

  it('renders with all props provided', async () => {
    const page = await newSpecPage({
      components: [FileInput],
      html: `
        <form-control-file
          label="Select a file"
          name="email"
          error="No file selected"
          disabled
        ></form-control-file>
      `,
    });

    const inputElement = page.root.querySelector('input');
    expect(page.rootInstance.label).toBe('Select a file');
    expect(inputElement.disabled).toBeTruthy();
  });

  it('handles user input correctly', async () => {
    const page = await newSpecPage({
      components: [FileInput],
      html: `<form-control-file></form-control-file>`,
    });

    const inputElement = page.root.querySelector('input');
    const testValue = 'Hello, World!';

    inputElement.value = testValue;
    await inputElement.dispatchEvent(new Event('input'));

    expect(inputElement.value).toBe(testValue);
  });

  it('emits formControlInput event on input', async () => {
    const page = await newSpecPage({
      components: [FileInput],
      html: `<form-control-file></form-control-file>`,
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

  it('emits formControlBlur event on blur', async () => {
    const page = await newSpecPage({
      components: [FileInput],
      html: `<form-control-file></form-control-file>`,
    });

    const blurEventSpy = jest.fn();
    page.win.addEventListener('formControlBlur', blurEventSpy);

    const inputElement = page.root.querySelector('input');
    inputElement.dispatchEvent(new Event('blur'));

    expect(blurEventSpy).toHaveBeenCalled();
  });

  it('disables input when disabled prop is true', async () => {
    const page = await newSpecPage({
      components: [FileInput],
      html: `<form-control-file disabled></form-control-file>`,
    });

    const inputElement = page.root.querySelector('input');
    expect(inputElement.disabled).toBeTruthy();
  });

  it('shows error and applies error styling when error prop is provided', async () => {
    const page = await newSpecPage({
      components: [FileInput, FormHelpText],
      html: `<form-control-file error-text="This field is required."></form-control-file>`,
    });

    const helpTextComponent = page.root.querySelector('form-help-text');
    expect(helpTextComponent).not.toBeNull();

    const errorText = helpTextComponent.querySelector('.text-danger');
    expect(errorText.textContent).toBe('This field is required.');
  });
});
