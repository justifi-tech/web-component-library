import { h } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';
import { Business, IBusiness } from "../../../../api/Business";
import { LegalAddressDetails } from "../legal-address-details";
import mockedBusinessDetails from '../../../../../../../mockData/mockBusinessDetails.json';

describe('LegalAddressDetails', () => {
  it('should render', async () => {
    const businessDetails = new Business(mockedBusinessDetails.data as unknown as IBusiness);
    const page = await newSpecPage({
      components: [LegalAddressDetails],
      template: () => (
        <legal-address-details legalAddress={businessDetails.legal_address}></legal-address-details>
      ),
    });
    await page.waitForChanges();
    expect(page.root).toMatchSnapshot();
  });
});
