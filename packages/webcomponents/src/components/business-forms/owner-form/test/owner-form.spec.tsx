import { newSpecPage } from '@stencil/core/testing';
import { OwnerForm } from '../owner-form';

describe('owner-form', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [OwnerForm],
      html: `<owner-form></owner-form>`,
    });
    expect(page.root).toEqualHtml(`
      <identity-form>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </identity-form>
    `);
  });
});
