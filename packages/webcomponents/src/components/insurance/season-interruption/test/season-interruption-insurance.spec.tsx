import { newSpecPage } from '@stencil/core/testing';
import { SeasonInterruptionInsurance } from '../season-interruption-insurance';
import { SeasonInterruptionInsuranceCore } from '../season-interruption-insurance-core';

describe('justifi-season-interruption-insurance', () => {
  it('renders loading', async () => {
    const page = await newSpecPage({
      components: [SeasonInterruptionInsurance, SeasonInterruptionInsuranceCore],
      html: '<justifi-season-interruption-insurance auth-token="123"></justifi-season-interruption-insurance>',
    });

    await page.waitForChanges();
    expect(page.root).toMatchSnapshot();
  });
});
