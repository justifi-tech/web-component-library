import { h } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';
import { SelectInput } from '../form-control-select';
import { FormControlErrorText } from '../form-helpers/form-control-error-text';
import { FormControlHelpText } from '../form-helpers/form-control-help-text';

describe('form-control-select', () => {
  const components = [SelectInput, FormControlErrorText, FormControlHelpText];
  const mockInputHandler = jest.fn();
  const options = [
    { label: 'Pickup', value: 'pickup' },
    { label: 'Delivery', value: 'delivery' }
  ];

  it('Renders with default props', async () => {
    const page = await newSpecPage({
      components: components,
      template: () => <form-control-select label='Select your delivery method' name='delivery_method' />
    });

    expect(page.root).toMatchSnapshot();
    expect(page.rootInstance.label).toBe('Select your delivery method');
    expect(page.rootInstance.name).toBe('delivery_method');
  });

  it('Renders with all props provided', async () => {
    const page = await newSpecPage({
      components: components,
      template: () =>
        <form-control-select
          label='Select your delivery method'
          name='delivery_method'
          defaultValue='pickup'
          errorText='This field is required.'
          helpText='Select your preferred delivery method'
          disabled
          inputHandler={mockInputHandler}
          options={options}
        />
    });

    expect(page.root).toMatchSnapshot();
  });

  it('Updates input value on defaultValue prop change', async () => {
    // Initial render with the default value
    let defaultValue = options[0].value;
    let page = await newSpecPage({
      components: components,
      template: () =>
        <form-control-select
          label='Select your delivery method'
          name='delivery_method'
          defaultValue={defaultValue}
          options={options}
        />
    });

    let selectElement = page.root.querySelector('select');
    expect(selectElement.value).toBe('pickup');

    defaultValue = options[1].value;

    // Re-render component with new defaultValue
    page = await newSpecPage({
      components: components,
      template: () =>
        <form-control-select
          label='Select your delivery method'
          name='delivery_method'
          defaultValue={defaultValue}
          options={options}
        />
    });
    selectElement = page.root.querySelector('select');
    expect(selectElement.value).toBe('delivery');
  });

  it('Populates options correctly', async () => {
    const page = await newSpecPage({
      components: components,
      template: () =>
        <form-control-select
          label='Select your delivery method'
          name='delivery_method'
          inputHandler={mockInputHandler}
          options={options}
        />
    });

    const selectElement = page.root.querySelector('select');
    expect(selectElement.children.length).toBe(options.length);

    expect(selectElement.children[0].textContent).toBe(options[0].label);
    expect(selectElement.children[1].textContent).toBe(options[1].label);

    expect(selectElement.children[0].getAttribute('value')).toBe(options[0].value);
    expect(selectElement.children[1].getAttribute('value')).toBe(options[1].value);
  });

  it('Handles user input correctly', async () => {
    const page = await newSpecPage({
      components: components,
      template: () =>
        <form-control-select
          label='Select your delivery method'
          name='delivery_method'
          inputHandler={mockInputHandler}
          options={options}
        />
    });

    const selectElement = page.root.querySelector('select');
    const testValue = options[1].value;

    selectElement.value = testValue;
    await selectElement.dispatchEvent(new Event('input'));

    expect(selectElement.value).toBe(testValue);
  });

  it('Emits formControlInput event on input', async () => {
    const page = await newSpecPage({
      components: components,
      template: () =>
        <form-control-select
          label='Select your delivery method'
          name='delivery_method'
          inputHandler={mockInputHandler}
          options={options}
        />
    });

    const inputEventSpy = jest.fn();
    page.root.addEventListener('formControlInput', inputEventSpy);

    const selectElement = page.root.querySelector('select');
    selectElement.value = '1';
    selectElement.dispatchEvent(new Event('input', { bubbles: true, composed: true }));

    await page.waitForChanges();
    expect(inputEventSpy).toHaveBeenCalled();
  });

  it('Emits formControlBlur event on blur', async () => {
    const page = await newSpecPage({
      components: components,
      template: () =>
        <form-control-select
          label='Select your delivery method'
          name='delivery_method'
          inputHandler={mockInputHandler}
          options={options}
        />
    });

    const blurEventSpy = jest.fn();
    page.root.addEventListener('formControlBlur', blurEventSpy);

    const selectElement = page.root.querySelector('select');
    selectElement.dispatchEvent(new Event('blur'));

    expect(blurEventSpy).toHaveBeenCalled();
  });

  it('Disables input when disabled prop is provided', async () => {
    const page = await newSpecPage({
      components: components,
      template: () =>
        <form-control-select
          label='Select your delivery method'
          name='delivery_method'
          disabled
        />
    });

    const selectElement = page.root.querySelector('select');
    expect(selectElement).toHaveAttribute('disabled');
  });

  it('Shows help text when helpText prop is provided', async () => {
    const page = await newSpecPage({
      components: components,
      template: () =>
        <form-control-select
          label='Select your delivery method'
          name='delivery_method'
          helpText='Select your preferred delivery method'
        />
    });

    const helpTextComponent = page.root.querySelector('#form-help-text-delivery_method');
    expect(helpTextComponent).not.toBeNull();

    expect(helpTextComponent.textContent).toBe('Select your preferred delivery method');
  });

  it('Shows error and applies error styling when error prop is provided', async () => {
    const page = await newSpecPage({
      components: components,
      template: () =>
        <form-control-select
          label='Select your delivery method'
          name='delivery_method'
          errorText='This field is required.'
        />
    });

    const errorTextComponent = page.root.querySelector('#form-error-text-delivery_method');
    expect(errorTextComponent).not.toBeNull();

    expect(errorTextComponent.textContent).toBe('This field is required.');

    const selectElement = page.root.querySelector('select');
    expect(selectElement.classList.contains('is-invalid')).toBe(true);
  });
});
