import { newSpecPage } from '@stencil/core/testing';
import { SelectInput } from '../select-input';

describe('select-input', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [SelectInput],
      html: `<select-input></select-input>`,
    });
    expect(page.root).toEqualHtml(`
      <select-input>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </select-input>
    `);
  });
});
