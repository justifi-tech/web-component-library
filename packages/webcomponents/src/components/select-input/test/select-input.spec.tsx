import { SpecPage, newSpecPage } from '@stencil/core/testing';
import { SelectInput } from '../select-input';

describe('select-input', () => {
  let page: SpecPage;

  beforeEach(async () => {
    page = await newSpecPage({
      components: [SelectInput],
      html: `<select-input></select-input>`,
    });
  });

  it('renders', async () => {
    page.root.options = [
      { label: 'Option 1', value: 'option1' },
      { label: 'Option 2', value: 'option2' },
    ];
    await page.waitForChanges();
    expect(page.root).toEqualHtml(`
    <select-input exportparts="label,input,input-invalid,invalid-feedback">
      <mock:shadow-root>
        <label part="label" class="form-label"></label>
        <select class="form-select" part="input">
          <option value="option1">
            Option 1
          </option>
          <option value="option2">
            Option 2
          </option>
        </select>
      </mock:shadow-root>
    </select-input>
  `);
  });

  it('renders with props', async () => {
    const { root } = await newSpecPage({
      components: [SelectInput],
      html: `<select-input name="test" label="Test Label"></select-input>`,
    });

    root.options = [{ label: 'Option 1', value: '1' }];
    await page.waitForChanges();

    expect(root).toEqualHtml(`
    <select-input exportparts="label,input,input-invalid,invalid-feedback" label="Test Label" name="test">
      <mock:shadow-root>
        <label part="label" class="form-label">Test Label</label>
        <select class="form-select" name="test" part="input">
          <option value="1">
            Option 1
          </option>
        </select>
      </mock:shadow-root>
    </select-input>
  `);
  });

  it('emits event on input', async () => {
    page.root.name = 'test';
    page.root.options = [{ label: 'Option 1', value: '1' }];
    await page.waitForChanges();

    const fieldReceivedInputHandler = jest.fn();
    page.root.addEventListener('fieldReceivedInput', fieldReceivedInputHandler);
    const select = page.root.shadowRoot.querySelector('select');
    select.value = '1';
    select.dispatchEvent(new Event('input'));
    expect(fieldReceivedInputHandler).toHaveBeenCalled();
  });

  it('renders with error', async () => {
    page.root.error = 'Test Error';
    await page.waitForChanges();
    expect(page.root).toEqualHtml(`
    <select-input exportparts="label,input,input-invalid,invalid-feedback">
      <mock:shadow-root>
        <label part="label" class="form-label"></label>
        <select class="form-select is-invalid" part="input input-invalid"></select>
        <div class="invalid-feedback" part="invalid-feedback">
          Test Error
        </div>
      </mock:shadow-root>
    </select-input>
  `);
  });
});
