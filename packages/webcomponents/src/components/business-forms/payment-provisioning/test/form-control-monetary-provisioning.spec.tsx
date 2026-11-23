import { h } from '@stencil/core';
import { newSpecPage } from "@stencil/core/testing";
import { CURRENCY_MASK } from "../../../../utils/form-input-masks";
import { FormControlMonetaryProvisioning } from "../form-control-monetary-provisioning";
import { FormControlErrorText } from '../../../../ui-components/form/form-helpers/form-control-error-text';
import { FormControlHelpText } from '../../../../ui-components/form/form-helpers/form-control-help-text';

describe('form-control-monetary-provisioning', () => {
  const components = [FormControlMonetaryProvisioning, FormControlErrorText, FormControlHelpText];
  const mockInputHandler = jest.fn();

  beforeEach(() => jest.clearAllMocks());

  it('renders correctly with default props', async () => {
    const page = await newSpecPage({
      components: components,
      template: () =>
        <form-control-monetary-provisioning
          label='Amount'
          name='amount'
          maskOptions={CURRENCY_MASK.WHOLE}
        />,
    });
    expect(page.root).toMatchSnapshot();
  });

  it('Renders with all props provided', async () => {
    const page = await newSpecPage({
      components: components,
      template: () =>
        <form-control-monetary-provisioning
          label='Amount'
          name='amount'
          helpText='Enter payment amount'
          errorText='Invalid amount'
          defaultValue='1500'
          inputHandler={mockInputHandler}
          maskOptions={CURRENCY_MASK.WHOLE}
        />,
    });
    expect(page.root).toMatchSnapshot();
  });

  it('Updates the input value when defaultValue changes', async () => {
    // Initial render with the default value
    let defaultValue = '1500';
    let page = await newSpecPage({
      components: components,
      template: () =>
        <form-control-monetary-provisioning
          label='Amount'
          name='amount'
          defaultValue={defaultValue}
          inputHandler={mockInputHandler}
          maskOptions={CURRENCY_MASK.WHOLE}
        />,
    });
    let inputElement = page.root.querySelector('input');
    expect(inputElement.value).toBe('1,500');

    defaultValue = '3000';

    // Re-render with the new default value
    page = await newSpecPage({
      components: components,
      template: () =>
        <form-control-monetary-provisioning
          label='Amount'
          name='amount'
          defaultValue={defaultValue}
          inputHandler={mockInputHandler}
          maskOptions={CURRENCY_MASK.WHOLE}
        />,
    });
    inputElement = page.root.querySelector('input');
    expect(inputElement.value).toBe('3,000');
  });

  it('Handles input correctly with whole number mask', async () => {
    const page = await newSpecPage({
      components: components,
      template: () =>
        <form-control-monetary-provisioning
          label='Amount'
          name='amount'
          inputHandler={mockInputHandler}
          maskOptions={CURRENCY_MASK.WHOLE}
        />,
    });

    const inputElement = page.root.querySelector('input');
    const testValue = '123456';

    inputElement.value = testValue;
    await inputElement.dispatchEvent(new Event('input'));

    expect(inputElement.value).toBe('123,456');
  });

  it('Handles input correctly with decimal mask', async () => {
    const page = await newSpecPage({
      components: components,
      template: () =>
        <form-control-monetary-provisioning
          label='Amount'
          name='amount'
          inputHandler={mockInputHandler}
          maskOptions={CURRENCY_MASK.DECIMAL}
        />,
    });

    const inputElement = page.root.querySelector('input');
    const testValue = '1234.56';

    inputElement.value = testValue;
    await inputElement.dispatchEvent(new Event('input'));

    expect(inputElement.value).toBe('1,234.56');
  });

  it('Passes the unmasked value to inputHandler on input change', async () => {
    const page = await newSpecPage({
      components: components,
      template: () =>
        <form-control-monetary-provisioning
          label='Amount'
          name='amount'
          inputHandler={mockInputHandler}
          maskOptions={CURRENCY_MASK.DECIMAL}
        />,
    });

    const inputElement = page.root.querySelector('input');
    inputElement.value = '150.99';

    inputElement.dispatchEvent(new Event('input', { bubbles: true, composed: true }));

    expect(mockInputHandler).toHaveBeenCalledWith('amount', '150.99');
  });

  it('Disables input when disabled prop is set', async () => {
    const page = await newSpecPage({
      components: components,
      template: () =>
        <form-control-monetary-provisioning
          label='Amount'
          name='amount'
          inputHandler={mockInputHandler}
          maskOptions={CURRENCY_MASK.DECIMAL}
          disabled
        />,
    });

    const input = page.root.querySelector('input');
    expect(input.disabled).toBe(true);
  });

  it('Shows help text when helpText prop is provided', async () => {
    const page = await newSpecPage({
      components: components,
      template: () =>
        <form-control-monetary-provisioning
          label='Amount'
          name='amount'
          inputHandler={mockInputHandler}
          maskOptions={CURRENCY_MASK.DECIMAL}
          helpText='Enter payment amount'
        />,
    });

    const helpTextComponent = page.root.querySelector('#form-help-text-amount');
    expect(helpTextComponent).not.toBeNull();

    expect(helpTextComponent.textContent).toBe('Enter payment amount');
  });

  it('Shows error and applies error styling when error prop is provided', async () => {
    const page = await newSpecPage({
      components: components,
      template: () =>
        <form-control-monetary-provisioning
          label='Amount'
          name='amount'
          inputHandler={mockInputHandler}
          maskOptions={CURRENCY_MASK.DECIMAL}
          errorText='Invalid amount'
        />,
    });

    const errorTextComponent = page.root.querySelector('#form-error-text-amount');
    expect(errorTextComponent).not.toBeNull();

    expect(errorTextComponent.textContent).toBe('Invalid amount');

    const inputElement = page.root.querySelector('input');
    expect(inputElement.classList.contains('is-invalid')).toBe(true);
  });
});
