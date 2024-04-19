import { newSpecPage } from "@stencil/core/testing";
import { DatePartInput } from "../form-control-datepart";
import * as IMaskPackage from 'imask';

jest.mock('imask', () => ({
  default: jest.fn().mockImplementation(() => ({
    on: jest.fn(),
    destroy: jest.fn(),
    value: '',
    unmaskedValue: '',
  })),
}));

const IMaskSpy = jest.spyOn(IMaskPackage, 'default');

afterEach(() => {
  jest.clearAllMocks();
});

describe('form-control-datepart', () => {
  it('renders correctly with default props', async () => {
    const page = await newSpecPage({
      components: [DatePartInput],
      html: `<form-control-datepart label="Date Part" name="datepart"></form-control-datepart>`,
    });
    expect(page.root).toMatchSnapshot();
  });

  it('should initialize IMask with correct options for "day" type', async () => {
    await newSpecPage({
      components: [DatePartInput],
      html: '<form-control-datepart type="day"></form-control-datepart>',
    });

    expect(IMaskSpy).toHaveBeenCalled();
    expect(IMaskSpy.mock.calls[0][1]).toEqual({ mask: Number, min: 1, max: 31 });
  });

  it('should initialize IMask with correct options for "month" type', async () => {
    // Clear mocks to reset the calls count
    jest.clearAllMocks();

    await newSpecPage({
      components: [DatePartInput],
      html: '<form-control-datepart type="month"></form-control-datepart>',
    });

    expect(IMaskSpy).toHaveBeenCalled();
    expect(IMaskSpy.mock.calls[0][1]).toEqual({ mask: Number, min: 1, max: 12 });
  });

  it('should initialize IMask with correct options for "year" type', async () => {
    // Clear mocks to reset the calls count
    jest.clearAllMocks();

    await newSpecPage({
      components: [DatePartInput],
      html: '<form-control-datepart type="year"></form-control-datepart>',
    });

    expect(IMaskSpy).toHaveBeenCalled();
    expect(IMaskSpy.mock.calls[0][1]).toEqual({ mask: Number, min: 1900, max: new Date().getFullYear() });
  });

  it('emits formControlBlur on input blur', async () => {
    const page = await newSpecPage({
      components: [DatePartInput],
      html: `<form-control-datepart></form-control-datepart>`,
    });

    const blurSpy = jest.fn();
    page.win.addEventListener('formControlBlur', blurSpy);

    const input = page.root.shadowRoot.querySelector('input');
    input.dispatchEvent(new Event('blur', { bubbles: true }));
    await page.waitForChanges();

    expect(blurSpy).toHaveBeenCalled();
  });

  it('calls inputHandler and emits formControlInput on user input', async () => {
    const inputHandlerMock = jest.fn();
    const page = await newSpecPage({
      components: [DatePartInput],
      html: `<form-control-datepart type="day" name="day"></form-control-datepart>`,
    });

    page.rootInstance.inputHandler = inputHandlerMock;
    await page.waitForChanges();

    const inputSpy = jest.fn();
    page.win.addEventListener('formControlInput', inputSpy);

    const input = page.root.shadowRoot.querySelector('input');
    input.value = '15'; // Assuming 'day' type for simplicity
    input.dispatchEvent(new Event('input', { bubbles: true }));
    await page.waitForChanges();

    expect(inputHandlerMock).toHaveBeenCalledWith('day', '15');
    expect(inputSpy).toHaveBeenCalled();
  });

  it('displays error message correctly', async () => {
    const page = await newSpecPage({
      components: [DatePartInput],
      html: `<form-control-datepart error="Error message"></form-control-datepart>`,
    });
    expect(page.root).toMatchSnapshot();
  });
});
