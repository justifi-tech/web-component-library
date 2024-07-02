import { newSpecPage } from "@stencil/core/testing";
import { NumberInputMasked } from "../form-control-number-masked";

describe('form-control-number-masked', () => {
  it('renders with default props', async () => {
    const page = await newSpecPage({
      components: [NumberInputMasked],
      html: `<form-control-number-masked label="Age"></form-control-number-masked>`,
    });
    expect(page.root).toMatchSnapshot();
  });

  it('renders with an error message', async () => {
    const page = await newSpecPage({
      components: [NumberInputMasked],
      html: `<form-control-number-masked label="Age" error-text="Invalid input"></form-control-number-masked>`,
    });
    expect(page.root).toMatchSnapshot();
  });

  it('handles the disabled state', async () => {
    const page = await newSpecPage({
      components: [NumberInputMasked],
      html: `<form-control-number-masked label="Age" disabled></form-control-number-masked>`,
    });
    expect(page.root).toMatchSnapshot();
  });

  it('updates the input value when defaultValue changes', async () => {
    const page = await newSpecPage({
      components: [NumberInputMasked],
      html: `<form-control-number-masked mask=${'00-00'} label="Masked Number"></form-control-number-masked>`,
    });
    let input = page.root.querySelector('input');
    expect(input.value).toBe(''); // Default should be empty

    page.root.inputHandler = jest.fn();
    page.root.defaultValue = '1234';
    await page.waitForChanges();

    input = page.root.querySelector('input');
    expect(input.value).toBe('12-34');
  });

  it.only('calls inputHandler on user input', async () => {
    const inputHandlerMock = jest.fn();
    const page = await newSpecPage({
      components: [NumberInputMasked],
      html: `<form-control-number-masked mask=${'00-00'} name='number'></form-control-number-masked>`,
      // template: () => (
      //   <form-control-number-masked mask={PHONE_MASKS.US} name='number' />
      // )
    });

    page.rootInstance.inputHandler = inputHandlerMock;
    await page.waitForChanges();

    const input = page.root.querySelector('input');
    input.value = '1234';
    await input.dispatchEvent(new Event('input', { bubbles: true }));

    expect(inputHandlerMock).toHaveBeenCalledWith('number', '1234');
  });
});