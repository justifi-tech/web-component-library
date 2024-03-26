import { h } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';
import { Business, IBusiness } from "../../../../api/Business";
import mockedBusinessDetails from '../../../../api/mockData/mockBusinessDetails.json';
import { JustifiRepresentativeDetails } from "../representative-details";

describe('RepresentativeDetails', () => {
  it('should render', async () => {
    const businessDetails = new Business(mockedBusinessDetails.data as unknown as IBusiness);

    const page = await newSpecPage({
      components: [JustifiRepresentativeDetails],
      template: () => (
        <representative-details representative={businessDetails.representative}></representative-details>
      ),
    });

    await page.waitForChanges();

    expect(page.root).toMatchSnapshot();
  });
});
