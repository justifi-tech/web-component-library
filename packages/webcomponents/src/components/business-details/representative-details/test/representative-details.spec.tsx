import { newSpecPage } from '@stencil/core/testing';
import { Business, IBusiness } from "../../../../api/Business";
import mockedBusinessDetails from '../../../../api/mockData/mockBusinessDetails.json';
import { JustifiRepresentativeDetails } from "../representative-details";

describe('RepresentativeDetails', () => {
  it('should render', async () => {
    const businessDetails = new Business(mockedBusinessDetails.data as unknown as IBusiness);

    const page = await newSpecPage({
      components: [JustifiRepresentativeDetails],
      html: (`
        <representative-details></representative-details>
      `),
    });

    page.rootInstance.representative = businessDetails.representative;

    await page.waitForChanges();

    expect(page.root).toMatchSnapshot();
  });
});
