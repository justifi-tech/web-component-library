import { newSpecPage } from '@stencil/core/testing';
import { Business, IBusiness } from "../../../../api/Business";
import { GenericInfoDetails } from "../generic-info-details";
import mockedBusinessDetails from '../../../../api/mockData/mockBusinessDetails.json';

describe('GenericInfoDetails', () => {
  it('should render', async () => {
    const businessDetails = new Business(mockedBusinessDetails.data as unknown as IBusiness);
    const page = await newSpecPage({
      components: [GenericInfoDetails],
      html: (` 
        <generic-info-details></generic-info-details> 
      `),
    });
    page.rootInstance.business = businessDetails;
    await page.waitForChanges();
    expect(page.root).toMatchSnapshot();
  });
});
