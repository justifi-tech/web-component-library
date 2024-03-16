import { newSpecPage } from '@stencil/core/testing';
import { Business, IBusiness } from "../../../../api/Business";
import mockedBusinessDetails from '../../../../api/mockData/mockBusinessDetails.json';
import { OwnerDetails } from '../owner-details';

describe('owner-details', () => {
  it('should render owner-details', async () => {
    const businessDetails = new Business(mockedBusinessDetails.data as unknown as IBusiness);

    const page = await newSpecPage({
      components: [OwnerDetails],
      html: (`
        <owner-details></owner-details>
      `),
    });

    page.rootInstance.owners = businessDetails.owners;

    await page.waitForChanges();

    expect(page.root).toMatchSnapshot();
  });
});
