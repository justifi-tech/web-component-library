import { h } from "@stencil/core";
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

    page.rootInstance.componentWillLoad = () => { };

    page.rootInstance.getBusiness = getBusiness;

    page.rootInstance.fetchData();

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
        fetchBusiness: async () => Promise.resolve(mockBusinessDetails),
      },
    });

    page.rootInstance.componentWillLoad = () => { };

    page.rootInstance.getBusiness = getBusiness;

    page.rootInstance.fetchData();

    await page.waitForChanges();

    const expectedBusiness = new Business(mockBusinessDetails.data as unknown as IBusiness);
    expect(page.rootInstance.business).toEqual(expectedBusiness);
    expect(page.root).toMatchSnapshot();
  });

  it('should emit error event when error occurs', async () => {
    const mockService = {
      fetchBusiness: jest.fn().mockRejectedValue('Fetch error')
    };

    const getBusiness = makeGetBusiness({
      id: 'some-id',
      authToken: 'some-auth-token',
      service: mockService,
    });

    const errorEventSpy = jest.fn();

    const page = await newSpecPage({
      components: [BusinessDetailsCore],
      template: () => (
        <business-details-core getBusiness={getBusiness} onErrorEvent={errorEventSpy} />
      ),
    });

    page.rootInstance.componentWillLoad = () => { };
    page.rootInstance.fetchData();
    await page.waitForChanges();
    expect(errorEventSpy).toHaveBeenCalledWith(
      expect.objectContaining({ detail: 'Fetch error' }),
    );
  });
});

