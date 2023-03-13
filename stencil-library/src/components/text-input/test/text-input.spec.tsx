import { newSpecPage } from '@stencil/core/testing';
import { TextInput } from '../text-input';

describe('text-input', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [TextInput],
      html: `<text-input></text-input>`,
    });
    expect(page.root).toEqualHtml(`
      <text-input>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </text-input>
    `);
  });
});
