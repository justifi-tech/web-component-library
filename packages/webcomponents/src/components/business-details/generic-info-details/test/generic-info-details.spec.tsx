import { h } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';
import { Business, IBusiness } from "../../../../api/Business";
import { GenericInfoDetails } from "../generic-info-details";
import mockedBusinessDetails from '../../../../api/mockData/mockBusinessDetails.json';

describe('GenericInfoDetails', () => {
  it('should render', async () => {
    const businessDetails = new Business(mockedBusinessDetails.data as unknown as IBusiness);
    const page = await newSpecPage({
      components: [GenericInfoDetails],
      template: () => (
        <generic-info-details business={businessDetails}></generic-info-details>
      ),
    });
    await page.waitForChanges();
    expect(page.root).toMatchSnapshot();
  });
});
