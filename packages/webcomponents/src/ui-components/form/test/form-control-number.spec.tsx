import { h } from '@stencil/core';
import { newSpecPage } from "@stencil/core/testing";
import { NumberInput } from "../form-control-number";
import { FormControlErrorText } from '../form-helpers/form-control-error-text';
import { FormControlHelpText } from '../form-helpers/form-control-help-text';

describe('form-control-number', () => {
  const components = [NumberInput, FormControlErrorText, FormControlHelpText];
  const mockInputHandler = jest.fn();

  it('Renders with default props', async () => {
    const page = await newSpecPage({
      components: components,
      template: () => <form-control-number label='Age' name='age' />
    });

    expect(page.root).toMatchSnapshot();
  });

  it('Renders with all props provided', async () => {
    const page = await newSpecPage({
      components: components,
      template: () =>
        <form-control-number
          label='Age'
          name='age'
          defaultValue='25'
          errorText='Invalid age'
          helpText='Enter your age'
          disabled
          inputHandler={mockInputHandler}
        />
    });

    expect(page.root).toMatchSnapshot();
  });

  it('Updates the input value when defaultValue changes', async () => {
    // Initial render with the default value
    let defaultValue = '25';
    let page = await newSpecPage({
      components: components,
      template: () =>
        <form-control-number
          label='Age'
          name='age'
          defaultValue={defaultValue}
          inputHandler={mockInputHandler}
        />
    });
    let inputElement = page.root.querySelector('input');
    expect(inputElement.value).toBe('25');

    defaultValue = '30';

    page = await newSpecPage({
      components: components,
      template: () =>
        <form-control-number
          label='Age'
          name='age'
          defaultValue={defaultValue}
          inputHandler={mockInputHandler}
        />
    });

    inputElement = page.root.querySelector('input');
    expect(inputElement.value).toBe('30');
  });

  it('Handles user input correctly', async () => {
    const page = await newSpecPage({
      components: components,
      template: () =>
        <form-control-number
          label='Age'
          name='age'
          defaultValue='25'
          inputHandler={mockInputHandler}
        />
    });

    const inputElement = page.root.querySelector('input');
    const testValue = '30';

    inputElement.value = testValue;
    await inputElement.dispatchEvent(new Event('input'));

    expect(inputElement.value).toBe(testValue);
  });

  it('Emits formControlInput event on input', async () => {
    const page = await newSpecPage({
      components: components,
      template: () =>
        <form-control-number
          label='Age'
          name='age'
          defaultValue='25'
          inputHandler={mockInputHandler}
        />
    });

    const inputEventSpy = jest.fn();
    page.win.addEventListener('formControlInput', inputEventSpy);

    const inputElement = page.root.querySelector('input');
    inputElement.value = '25';

    inputElement.dispatchEvent(new Event('input', { bubbles: true, composed: true }));

    expect(inputEventSpy).toHaveBeenCalledWith(expect.objectContaining({
      detail: expect.objectContaining({
        name: 'age',
        value: '25',
      }),
    }));
  });

  it('Emits formControlBlur event on blur', async () => {
    const page = await newSpecPage({
      components: components,
      template: () =>
        <form-control-number
          label='Age'
          name='age'
          inputHandler={mockInputHandler}
        />
    });
    const blurEventSpy = jest.fn();
    page.win.addEventListener('formControlBlur', blurEventSpy);

    const inputElement = page.root.querySelector('input');
    await inputElement.dispatchEvent(new CustomEvent('blur'));

    expect(blurEventSpy).toHaveBeenCalled();
  });

  it('Disables input when disabled prop is provided', async () => {
    const page = await newSpecPage({
      components: components,
      template: () =>
        <form-control-number
          label='Age'
          name='age'
          disabled
          inputHandler={mockInputHandler}
        />
    });

    const inputElement = page.root.querySelector('input');
    expect(inputElement.disabled).toBe(true);
  });

  it('Shows help text when helpText prop is provided', async () => {
    const page = await newSpecPage({
      components: components,
      template: () =>
        <form-control-number
          label='Age'
          name='age'
          helpText='Enter your age'
          inputHandler={mockInputHandler}
        />
    });

    const helpTextComponent = page.root.querySelector('#form-help-text-age');
    expect(helpTextComponent).not.toBeNull();

    expect(helpTextComponent.textContent).toBe('Enter your age');
  });

  it('Shows error and applies error styling when error prop is provided', async () => {
    const page = await newSpecPage({
      components: components,
      template: () =>
        <form-control-number
          label='Age'
          name='age'
          errorText='Invalid age'
          inputHandler={mockInputHandler}
        />
    });

    const errorTextComponent = page.root.querySelector('#form-error-text-age');
    expect(errorTextComponent).not.toBeNull();

    expect(errorTextComponent.textContent).toBe('Invalid age');

    const inputElement = page.root.querySelector('input');
    expect(inputElement.classList.contains('is-invalid')).toBe(true);
  });
});
