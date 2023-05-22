import { newSpecPage } from '@stencil/core/testing';
import { BusinessInformation } from '../business-information';

describe('business-information', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [BusinessInformation],
      html: `<business-information></business-information>`,
    });
    expect(page.root).toEqualHtml(`
      <business-information>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </business-information>
    `);
  });
});
