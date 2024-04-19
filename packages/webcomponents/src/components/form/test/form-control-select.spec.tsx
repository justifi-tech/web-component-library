import { newSpecPage } from '@stencil/core/testing';
import { SelectInput } from '../form-control-select';

describe('form-control-select', () => {
  it('renders with default props', async () => {
    const page = await newSpecPage({
      components: [SelectInput],
      html: `<form-control-select label="Test Select" name="test"></form-control-select>`,
    });

    expect(page.root).toMatchSnapshot();
    expect(page.rootInstance.label).toBe('Test Select');
    expect(page.rootInstance.name).toBe('test');
  });

  it('populates options correctly and handles selection', async () => {
    const options = [
      { label: 'Option 1', value: '1' },
      { label: 'Option 2', value: '2' }
    ];
    const page = await newSpecPage({
      components: [SelectInput],
      html: `<form-control-select></form-control-select>`,
    });
    page.rootInstance.options = options;
    await page.waitForChanges();

    const selectElement = page.root.shadowRoot.querySelector('select');
    expect(selectElement.children.length).toBe(options.length);
    expect(selectElement.children[0].textContent).toBe(options[0].label);

    selectElement.value = options[1].value;
    expect(selectElement.value).toBe('2');
  });

  it('shows error and applies error styling when error prop is provided', async () => {
    const page = await newSpecPage({
      components: [SelectInput],
      html: `<form-control-select error="This field is required."></form-control-select>`,
    });

    const shadowRoot = page.root.shadowRoot;
    expect(shadowRoot.querySelector('.invalid-feedback').textContent).toBe('This field is required.');
    expect(shadowRoot.querySelector('.form-select').classList.contains('is-invalid')).toBeTruthy();
  });

  it('emits formControlInput event on input', async () => {
    const page = await newSpecPage({
      components: [SelectInput],
      html: `<form-control-select></form-control-select>`,
    });

    page.rootInstance.inputHandler = jest.fn();

    const inputEventSpy = jest.fn();
    page.root.addEventListener('formControlInput', inputEventSpy);

    const selectElement = page.root.shadowRoot.querySelector('select');
    selectElement.value = '1';
    selectElement.dispatchEvent(new Event('input', { bubbles: true, composed: true }));

    await page.waitForChanges();
    expect(inputEventSpy).toHaveBeenCalled();
  });

  it('emits formControlBlur event on blur', async () => {
    const page = await newSpecPage({
      components: [SelectInput],
      html: `<form-control-select></form-control-select>`,
    });

    const blurEventSpy = jest.fn();
    page.root.addEventListener('formControlBlur', blurEventSpy);

    const selectElement = page.root.shadowRoot.querySelector('select');
    selectElement.dispatchEvent(new Event('blur'));

    expect(blurEventSpy).toHaveBeenCalled();
  });

  it('disables select when disabled prop is true', async () => {
    const page = await newSpecPage({
      components: [SelectInput],
      html: `<form-control-select disabled="true"></form-control-select>`,
    });

    const selectElement = page.root.shadowRoot.querySelector('select');

    // This is weird, but the value of the disabled 
    // attribute is an empty string on Stencil mock DOM
    expect(selectElement.attributes.getNamedItem('disabled').value).toBe('');
  });

  it('handles empty options array', async () => {
    const page = await newSpecPage({
      components: [SelectInput],
      html: `<form-control-select></form-control-select>`,
    });
    page.rootInstance.options = [];
    await page.waitForChanges();

    const selectElement = page.root.shadowRoot.querySelector('select');
    expect(selectElement.children.length).toBe(0);
  });
});
