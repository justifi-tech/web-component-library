import { h } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';
import { FileInput } from '../form-control-file';
import { FormControlErrorText } from '../form-helpers/form-control-error-text';
import { TooltipComponent } from '../form-helpers/form-control-tooltip/form-control-tooltip';

describe('form-control-file', () => {
  const components = [FileInput, FormControlErrorText, TooltipComponent];
  const mockInputHandler = jest.fn();

  it('Renders with default props', async () => {
    const page = await newSpecPage({
      components: components,
      template: () => <form-control-file label='Profile Picture' name='profilePicture'></form-control-file>,
    });

    expect(page.root).toMatchSnapshot();
    expect(page.rootInstance.label).toBe('Profile Picture');
    expect(page.rootInstance.name).toBe('profilePicture');
  });

  it('Renders with all props provided', async () => {
    const page = await newSpecPage({
      components: components,
      template: () =>
        <form-control-file
          label='Resume'
          name='resume'
          errorText='Invalid file type'
          helpText='Upload your resume in PDF format'
          disabled
          inputHandler={mockInputHandler}
        >
        </form-control-file>
    });

    expect(page.root).toMatchSnapshot();
  });

  it('Handles user input correctly', async () => {
    const page = await newSpecPage({
      components: components,
      template: () =>
        <form-control-file
          label='Government ID'
          name='governmentId'
          inputHandler={mockInputHandler}
        >
        </form-control-file>
    });

    const inputElement = page.root.querySelector('input');
    const testValue = 'govermnent-id.jpg';

    inputElement.value = testValue;
    await inputElement.dispatchEvent(new Event('input'));

    expect(inputElement.value).toBe(testValue);
  });

  it('Emits formControlInput event on input', async () => {
    const page = await newSpecPage({
      components: components,
      template: () =>
        <form-control-file
          label='Government ID'
          name='governmentId'
          inputHandler={mockInputHandler}
        >
        </form-control-file>
    });

    const inputEventSpy = jest.fn();
    page.root.addEventListener('formControlInput', inputEventSpy);

    const inputElement = page.root.querySelector('input');
    inputElement.value = 'govermnent-id.jpg';

    inputElement.dispatchEvent(new Event('input', { bubbles: true, composed: true }));

    expect(inputEventSpy).toHaveBeenCalledWith(expect.objectContaining({
      detail: expect.objectContaining({
        name: 'governmentId',
        value: 'govermnent-id.jpg'
      })
    }));
  });

  it('Emits formControlBlur event on blur', async () => {
    const page = await newSpecPage({
      components: components,
      template: () =>
        <form-control-file
          label='Government ID'
          name='governmentId'
          inputHandler={mockInputHandler}
        >
        </form-control-file>
    });

    const blurEventSpy = jest.fn();
    page.root.addEventListener('formControlBlur', blurEventSpy);

    const inputElement = page.root.querySelector('input');
    inputElement.dispatchEvent(new Event('blur'));

    expect(blurEventSpy).toHaveBeenCalled();
  });

  it('Disables input when disabled prop is true', async () => {
    const page = await newSpecPage({
      components: components,
      template: () =>
        <form-control-file
          label='Government ID'
          name='governmentId'
          disabled
        >
        </form-control-file>
    });

    const inputElement = page.root.querySelector('input');
    expect(inputElement.disabled).toBeTruthy();
  });

  it('Shows tooltip when helpText prop is provided', async () => {
    const page = await newSpecPage({
      components: components,
      template: () =>
        <form-control-file
          label='Government ID'
          name='governmentId'
          inputHandler={mockInputHandler}
          helpText='Select a file to upload.'
        >
        </form-control-file>
    });

    const tooltipComponent = page.root.querySelector('form-control-tooltip');
    expect(tooltipComponent).not.toBeNull();

    const tooltipIcon = tooltipComponent.querySelector('.bi-question-square');
    expect(tooltipIcon).not.toBeNull();

    const tooltipElement = tooltipComponent.querySelector('.tooltip');
    expect(tooltipElement).not.toBeNull();

    const tooltipText = tooltipElement.querySelector('.tooltip-inner');
    expect(tooltipText.textContent).toBe('Select a file to upload.');
  });

  it('Shows error and applies error styling when error prop is provided', async () => {
    const page = await newSpecPage({
      components: components,
      template: () =>
        <form-control-file
          label='Government ID'
          name='governmentId'
          inputHandler={mockInputHandler}
          errorText='This field is required.'
        >
        </form-control-file>
    });

    const errorTextComponent = page.root.querySelector('#form-error-text-governmentId');
    expect(errorTextComponent).not.toBeNull();

    expect(errorTextComponent.textContent).toBe('This field is required.');

    const inputElement = page.root.querySelector('input');
    expect(inputElement.classList.contains('is-invalid')).toBe(true);
  });
});
