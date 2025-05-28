import { h } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';
import { Business, IBusiness } from "../../../../api/Business";
import { CoreInfoDetails } from "../core-info-details";
import mockedBusinessDetails from '../../../../../../../mockData/mockBusinessDetails.json';

describe('CoreInfoDetails', () => {
  it('should render', async () => {
    const businessDetails = new Business(mockedBusinessDetails.data as unknown as IBusiness);
    const page = await newSpecPage({
      components: [CoreInfoDetails],
      template: () => (
        <core-info-details business={businessDetails}></core-info-details>
      ),
    });
    await page.waitForChanges();
    expect(page.root).toMatchSnapshot();
  });
});
