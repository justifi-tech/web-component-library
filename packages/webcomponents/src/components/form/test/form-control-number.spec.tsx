import { newSpecPage } from "@stencil/core/testing";
import { NumberInput } from "../form-control-number";

describe('form-control-number', () => {
  it('renders with default props', async () => {
    const page = await newSpecPage({
      components: [NumberInput],
      html: `<form-control-number label="Age"></form-control-number>`,
    });
    expect(page.root).toMatchSnapshot();
  });

  it('renders with an error message', async () => {
    const page = await newSpecPage({
      components: [NumberInput],
      html: `<form-control-number label="Age" error="Invalid input"></form-control-number>`,
    });
    expect(page.root).toMatchSnapshot();
  });

  it('handles the disabled state', async () => {
    const page = await newSpecPage({
      components: [NumberInput],
      html: `<form-control-number label="Age" disabled></form-control-number>`,
    });
    expect(page.root).toMatchSnapshot();
  });

  it('updates the input value when defaultValue changes', async () => {
    const page = await newSpecPage({
      components: [NumberInput],
      html: `<form-control-number label="Age"></form-control-number>`,
    });
    let input = page.root.shadowRoot.querySelector('input');
    expect(input.value).toBe(''); // Default should be empty

    page.root.defaultValue = '30';
    await page.waitForChanges();

    input = page.root.shadowRoot.querySelector('input');
    expect(input.value).toBe('30');
  });

  it('calls inputHandler on user input', async () => {
    const inputHandlerMock = jest.fn();
    const page = await newSpecPage({
      components: [NumberInput],
      html: `<form-control-number name="age"></form-control-number>`,
    });

    page.rootInstance.inputHandler = inputHandlerMock;
    await page.waitForChanges();

    const input = page.root.shadowRoot.querySelector('input');
    input.value = '25';
    await input.dispatchEvent(new Event('input', { bubbles: true }));

    expect(inputHandlerMock).toHaveBeenCalledWith('age', '25');
  });

  it('emits formControlBlur on input blur', async () => {
    const page = await newSpecPage({
      components: [NumberInput],
      html: `<form-control-number></form-control-number>`,
    });
    const blurSpy = jest.fn();
    page.win.addEventListener('formControlBlur', blurSpy);

    const input = page.root.shadowRoot.querySelector('input');
    await input.dispatchEvent(new CustomEvent('blur'));

    expect(blurSpy).toHaveBeenCalled();
  });

  it('emits formControlInput on input', async () => {
    const page = await newSpecPage({
      components: [NumberInput],
      html: `<form-control-number name="age"></form-control-number>`,
    });
    page.rootInstance.inputHandler = jest.fn();
    await page.waitForChanges();

    const inputSpy = jest.fn();
    page.win.addEventListener('formControlInput', inputSpy);

    const input = page.root.shadowRoot.querySelector('input');
    input.value = '25';
    const mockEvent = new Event('input', { bubbles: true });
    Object.defineProperty(mockEvent, 'target', { value: input, enumerable: true });
    await input.dispatchEvent(mockEvent);

    expect(inputSpy).toHaveBeenCalled();
  });
});
