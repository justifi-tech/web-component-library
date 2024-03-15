import { newSpecPage } from '@stencil/core/testing';
import { IdentityForm } from '../identity-form';

describe('identity-form', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [IdentityForm],
      html: `<identity-form></identity-form>`,
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
