import { newSpecPage } from '@stencil/core/testing';
import { TextField } from '../text-field';

describe('text-field', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [TextField],
      html: `<text-field></text-field>`,
    });
    expect(page.root).toEqualHtml(`
      <text-field>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </text-field>
    `);
  });
});
