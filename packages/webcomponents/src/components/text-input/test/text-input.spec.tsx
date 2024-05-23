import { newSpecPage } from '@stencil/core/testing';
import { TextInput } from '../text-input';

describe('text-input', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [TextInput],
      html: `<text-input></text-input>`,
    });
    expect(page.root).toEqualHtml(`
      <text-input exportparts="label,input,input-invalid,invalid-feedback">
        <mock:shadow-root>
          <label class="form-label" part="label"></label>
          <input class="form-control" part="input" type="text">
        </mock:shadow-root>
      </text-input>
    `);
  });

  it('renders with values', async () => {
    const page = await newSpecPage({
      components: [TextInput],
      html: `<text-input name="test" label="Test" default-value="Hello"></text-input>`,
    });
    expect(page.root).toEqualHtml(`
      <text-input name="test" label="Test" default-value="Hello" exportparts="label,input,input-invalid,invalid-feedback">
        <mock:shadow-root>
          <label class="form-label" part="label">Test</label>
          <input class="form-control" name="test" part="input" type="text" value="Hello">
        </mock:shadow-root>
      </text-input>
    `);
  });

  it('renders with error', async () => {
    const page = await newSpecPage({
      components: [TextInput],
      html: `<text-input error="Something went wrong"></text-input>`,
    });
    expect(page.root).toEqualHtml(`
      <text-input error="Something went wrong" exportparts="label,input,input-invalid,invalid-feedback">
        <mock:shadow-root>
          <label class="form-label" part="label"></label>
          <input class="form-control is-invalid" part="input input-invalid" type="text">
          <div class="invalid-feedback" part="invalid-feedback">Something went wrong</div>
        </mock:shadow-root>
      </text-input>
    `);
  });

  it('emits fieldReceivedInput event on input', async () => {
    const page = await newSpecPage({
      components: [TextInput],
      html: `<text-input name="test" label="Test" default-value="Hello"></text-input>`,
    });

    const input = page.root.shadowRoot.querySelector('input');
    let receivedEvent = null;
    page.root.addEventListener('fieldReceivedInput', e => (receivedEvent = e));

    input.value = 'Updated text';
    input.dispatchEvent(new Event('input'));

    await page.waitForChanges();
    expect(receivedEvent.detail).toEqual({ name: 'test', value: 'Updated text' });
  });
});
