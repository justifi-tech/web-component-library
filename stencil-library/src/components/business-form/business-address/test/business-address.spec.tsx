import { newSpecPage } from '@stencil/core/testing';
import { BusinessAddressForm } from '../business-address-form';

describe('business-address-form', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [BusinessAddressForm],
      html: `<business-address-form></business-address-form>`,
    });
    expect(page.root).toEqualHtml(`
      <business-address-form>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </business-address-form>
    `);
  });
});
