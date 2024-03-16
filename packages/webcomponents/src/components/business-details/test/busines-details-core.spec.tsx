import { newSpecPage } from "@stencil/core/testing";
import { BusinessDetailsCore } from "../business-details-core";
import { makeGetBusiness } from "../get-business";
import mockBusinessDetails from './../../../api/mockData/mockBusinessDetails.json';
import { Business, IBusiness } from "../../../api/Business";

describe('BusinessDetailsCore', () => {
  it('should display loading state correclty', async () => {
    const page = await newSpecPage({
      components: [BusinessDetailsCore],
      html: '<business-details-core></business-details-core>',
    });

    await page.waitForChanges();

    expect(page.root).toMatchSnapshot();
  });

  it('should display error state correctly', async () => {
    const page = await newSpecPage({
      components: [BusinessDetailsCore],
      html: '<business-details-core></business-details-core>',
    });

    const getBusiness = makeGetBusiness({
      id: '',
      authToken: '',
      service: {
        fetchBusiness: async () => ({ error: 'error' }),
      },
    });

    page.rootInstance.getBusiness = getBusiness;

    await page.waitForChanges();

    expect(page.root).toMatchSnapshot();
  });

  it('should set business details correctly to state', async () => {
    const page = await newSpecPage({
      components: [BusinessDetailsCore],
      html: '<business-details-core></business-details-core>',
    });

    const getBusiness = makeGetBusiness({
      id: '',
      authToken: '',
      service: {
        fetchBusiness: async () => (mockBusinessDetails),
      },
    });

    page.rootInstance.componentWillLoad = () => { };

    page.rootInstance.getBusiness = getBusiness;

    await page.waitForChanges();

    page.rootInstance.fetchData();

    await page.waitForChanges();

    const expectedBusiness = new Business(mockBusinessDetails.data as unknown as IBusiness);
    expect(page.rootInstance.business).toEqual(expectedBusiness);
  });
});

