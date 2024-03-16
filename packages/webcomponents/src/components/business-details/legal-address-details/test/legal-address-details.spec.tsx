import { newSpecPage } from '@stencil/core/testing';
import { Business, IBusiness } from "../../../../api/Business";
import { LegalAddressDetails } from "../legal-address-details";
import mockedBusinessDetails from '../../../../api/mockData/mockBusinessDetails.json';

describe('LegalAddressDetails', () => {
  it('should render', async () => {
    const businessDetails = new Business(mockedBusinessDetails.data as unknown as IBusiness);
    const page = await newSpecPage({
      components: [LegalAddressDetails],
      html: (`
        <legal-address-details></legal-address-details>
      `),
    });
    page.rootInstance.legalAddress = businessDetails.legal_address;
    await page.waitForChanges();
    expect(page.root).toMatchSnapshot();
  });
});
