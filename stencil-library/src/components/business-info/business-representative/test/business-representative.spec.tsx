import { newSpecPage } from '@stencil/core/testing';
import { BusinessRepresentative } from '../business-representative';

describe('business-representative', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [BusinessRepresentative],
      html: `<business-representative></business-representative>`,
    });
    expect(page.root).toEqualHtml(`
      <business-representative>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </business-representative>
    `);
  });
});
