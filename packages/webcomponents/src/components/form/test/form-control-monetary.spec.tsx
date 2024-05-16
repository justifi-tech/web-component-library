import { newSpecPage } from "@stencil/core/testing";
import { MonetaryInput } from "../form-control-monetary";
import { CURRENCY_MASK } from "../../../utils/form-input-masks";

describe('form-control-monetary', () => {
  it('renders correctly with default props', async () => {
    const page = await newSpecPage({
      components: [MonetaryInput],
      html: `<form-control-monetary></form-control-monetary>`,
    });
    expect(page.root).toMatchSnapshot();
  });

  it('handles props correctly', async () => {
    const page = await newSpecPage({
      components: [MonetaryInput],
      html: `
      <form-control-monetary
        label="Amount"
        name="amount"
        error="Invalid amount"  
        defaultValue="1000"
        maskOptions=${CURRENCY_MASK.DECIMAL}
      ></form-control-monetary>
    `,
    });
    await page.waitForChanges();

    const label = page.root.shadowRoot.querySelector('label');
    const input = page.root.shadowRoot.querySelector('input');
    const errorDiv = page.root.shadowRoot.querySelector('.invalid-feedback');

    expect(label.textContent).toBe('Amount');
    expect(input.getAttribute('name')).toBe('amount');
    expect(errorDiv.textContent).toBe('Invalid amount');
  });

  it('calls inputHandler and emits formControlInput on user input', async () => {
    const inputHandlerMock = jest.fn();
    const page = await newSpecPage({
      components: [MonetaryInput],
      html: `<form-control-monetary maskOptions=${CURRENCY_MASK.DECIMAL}></form-control-monetary>`,
    });

    page.rootInstance.inputHandler = inputHandlerMock;
    await page.waitForChanges();

    const inputSpy = jest.fn();
    page.win.addEventListener('formControlInput', inputSpy);

    const input = page.root.shadowRoot.querySelector('input');
    input.value = '1234.56';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    await page.waitForChanges();

    expect(inputHandlerMock).toHaveBeenCalled();
    expect(inputSpy).toHaveBeenCalled();
  });

  it('emits formControlBlur on input blur', async () => {
    const page = await newSpecPage({
      components: [MonetaryInput],
      html: `<form-control-monetary maskOptions=${CURRENCY_MASK.DECIMAL}></form-control-monetary>`,
    });

    const blurSpy = jest.fn();
    page.win.addEventListener('formControlBlur', blurSpy);

    const input = page.root.shadowRoot.querySelector('input');
    input.dispatchEvent(new Event('blur', { bubbles: true }));
    await page.waitForChanges();

    expect(blurSpy).toHaveBeenCalled();
  });

  it('displays error message when error prop is set', async () => {
    const page = await newSpecPage({
      components: [MonetaryInput],
      html: `<form-control-monetary error="Invalid amount" maskOptions=${CURRENCY_MASK.DECIMAL}></form-control-monetary>`,
    });

    const errorDiv = page.root.shadowRoot.querySelector('.invalid-feedback');
    expect(errorDiv.textContent).toBe('Invalid amount');
    expect(page.root).toMatchSnapshot();
  });
});
