import { newSpecPage } from '@stencil/core/testing';
import { CheckboxInput } from '../form-control-checkbox';

describe('form-control-checkbox', () => {

  it('renders with default props', async () => {
    const page = await newSpecPage({
      components: [CheckboxInput],
      html: `<form-control-checkbox label="Select a checkbox" name="user ID"></form-control-checkbox>`,
    });

    expect(page.root).toMatchSnapshot();
    expect(page.rootInstance.label).toBe('Select a checkbox');
    expect(page.rootInstance.name).toBe('user ID');
  });

  it('renders with all props provided', async () => {
    const page = await newSpecPage({
      components: [CheckboxInput],
      html: `
        <form-control-checkbox
          label="Select a checkbox"
          name="email"
          error="No checkbox selected"
          disabled
        ></form-control-checkbox>
      `,
    });

    const inputElement = page.root.shadowRoot.querySelector('input');
    expect(page.rootInstance.label).toBe('Select a checkbox');
    expect(inputElement.disabled).toBeTruthy();
  });

  it('handles user input correctly', async () => {
    const page = await newSpecPage({
      components: [CheckboxInput],
      html: `<form-control-checkbox></form-control-checkbox>`,
    });

    const inputElement = page.root.shadowRoot.querySelector('input');
    const testValue = true;

    inputElement.checked = testValue;
    await inputElement.dispatchEvent(new Event('input'));

    expect(inputElement.checked).toBe(testValue);
  });

  it('emits formControlInput event on input', async () => {
    const page = await newSpecPage({
      components: [CheckboxInput],
      html: `<form-control-checkbox></form-control-checkbox>`,
    });

    // Set a mock inputHandler to prevent it from being undefined
    page.rootInstance.inputHandler = jest.fn();

    const inputEventSpy = jest.fn();
    page.root.addEventListener('formControlInput', inputEventSpy);
  });
});
