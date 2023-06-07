import { newSpecPage } from '@stencil/core/testing';
import { BusinessAddress } from '../business-address';

describe('business-address', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [BusinessAddress],
      html: `<business-address></business-address>`,
    });
    expect(page.root).toEqualHtml(`
      <business-address>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </business-address>
    `);
  });
});
