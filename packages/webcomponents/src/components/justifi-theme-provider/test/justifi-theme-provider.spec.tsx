import { newSpecPage } from '@stencil/core/testing';
import { JustifiThemeProvider } from '../justifi-theme-provider';

describe('justifi-theme-provider', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [JustifiThemeProvider],
      html: `<justifi-theme-provider></justifi-theme-provider>`,
    });
    expect(page.root).toEqualHtml(`
      <justifi-theme-provider>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </justifi-theme-provider>
    `);
  });
});
