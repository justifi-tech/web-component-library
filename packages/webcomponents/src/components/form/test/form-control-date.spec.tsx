import { h } from '@stencil/core';
import { newSpecPage } from "@stencil/core/testing";
import { DateInput } from "../form-control-date";
import { FormControlErrorText } from '../form-helpers/form-control-error-text/form-control-error-text';
import { TooltipComponent } from '../form-helpers/form-control-tooltip/form-control-tooltip';

describe('form-control-date', () => {
  const components = [DateInput, FormControlErrorText, TooltipComponent];
  const mockInputHandler = jest.fn();

  it('Renders with default props', async () => {
    const page = await newSpecPage({
      components: components,
      template: () => <form-control-date label='Birthday' name='birthday'/>,
    });

    expect(page.root).toMatchSnapshot();
  });

  it('Renders with all props provided', async () => {
    const page = await newSpecPage({
      components: components,
      template: () =>
        <form-control-date
          label='Birthday'
          name='birthday'
          defaultValue='1990-01-01'
          errorText='Invalid date'
          helpText='Enter your birthday'
          disabled
          inputHandler={mockInputHandler}
        />
    });

    expect(page.root).toMatchSnapshot();
  });

  it('Updates the input value when defaultValue changes', async () => {
    // Initial render with the default value
    let defaultValue = '1990-01-01';
    let page = await newSpecPage({
      components: components,
      template: () =>
        <form-control-date
          label='Birthday'
          name='birthday'
          defaultValue={defaultValue}
          inputHandler={mockInputHandler}
        />
    });
    let inputElement = page.root.querySelector('input');
    expect(inputElement.value).toBe('1990-01-01');

    defaultValue = '2000-01-01';

    // Re-render with the new default value
    page = await newSpecPage({
      components: components,
      template: () =>
        <form-control-date
          label='Birthday'
          name='birthday'
          defaultValue={defaultValue}
          inputHandler={mockInputHandler}
        />
    });
    inputElement = page.root.querySelector('input');
    expect(inputElement.value).toBe('2000-01-01');
  });

  it('Handles user input correctly', async () => {
    const page = await newSpecPage({
      components: components,
      template: () =>
        <form-control-date
          label='Birthday'
          name='birthday'
          defaultValue='1990-01-01'
          inputHandler={mockInputHandler}
        />
    });

    const inputElement = page.root.querySelector('input');
    const testValue = '2000-01-01';

    inputElement.value = testValue;
    await inputElement.dispatchEvent(new Event('input'));

    expect(inputElement.value).toBe(testValue);
  });

  it('Emits formControlInput event on input', async () => {
    const page = await newSpecPage({
      components: components,
      template: () =>
        <form-control-date
          label='Birthday'
          name='birthday'
          defaultValue='1990-01-01'
          inputHandler={mockInputHandler}
        />
    });

    const inputEventSpy = jest.fn();
    page.win.addEventListener('formControlInput', inputEventSpy);

    const inputElement = page.root.querySelector('input');
    inputElement.value = '2000-01-01';

    inputElement.dispatchEvent(new Event('input', { bubbles: true, composed: true }));

    expect(inputEventSpy).toHaveBeenCalledWith(expect.objectContaining({
      detail: expect.objectContaining({
        name: 'birthday',
        value: '2000-01-01',
      }),
    }));
  });

  it('Emits formControlBlur event on blur', async () => {
    const page = await newSpecPage({
      components: components,
      template: () =>
        <form-control-date
          label='Birthday'
          name='birthday'
          inputHandler={mockInputHandler}
        />
    });

    const blurEventSpy = jest.fn();
    page.win.addEventListener('formControlBlur', blurEventSpy);

    const inputElement = page.root.querySelector('input');
    inputElement.dispatchEvent(new Event('blur', { bubbles: true, composed: true }));

    expect(blurEventSpy).toHaveBeenCalled();
  });

  it('Disables input when disabled prop is provided', async () => {
    const page = await newSpecPage({
      components: components,
      template: () =>
        <form-control-date
          label='Date'
          name='date'
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
        <form-control-date
          label='Date'
          name='date'
          helpText='Select your date'
          inputHandler={mockInputHandler}
        />
    });

    const tooltipComponent = page.root.querySelector('form-control-tooltip');
    expect(tooltipComponent).not.toBeNull();

    const tooltipIcon = tooltipComponent.querySelector('.bi-question-square');
    expect(tooltipIcon).not.toBeNull();

    const tooltipElement = tooltipComponent.querySelector('.tooltip');
    expect(tooltipElement).not.toBeNull();

    const tooltipText = tooltipElement.querySelector('.tooltip-inner');
    expect(tooltipText.textContent).toBe('Select your date');
  });

  it('Shows error and applies error styling when error prop is provided', async () => {
    const page = await newSpecPage({
      components: components,
      template: () =>
        <form-control-date
          label='Date'
          name='date'
          errorText='Invalid date'
          inputHandler={mockInputHandler}
        />
    });

    const errorTextComponent = page.root.querySelector('form-control-error-text');
    expect(errorTextComponent).not.toBeNull();

    const errorText = errorTextComponent.querySelector('.text-danger');
    expect(errorText.textContent).toBe('Invalid date');

    const inputElement = page.root.querySelector('input');
    expect(inputElement.classList.contains('is-invalid')).toBe(true);
  });
});