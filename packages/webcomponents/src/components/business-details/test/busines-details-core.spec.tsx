jest.mock('../../../utils/styled-host/modified-bootstrap.css', () => '');

import { h } from "@stencil/core";
import { newSpecPage } from "@stencil/core/testing";
import { BusinessDetailsCore } from "../business-details-core";
import { makeGetBusiness } from "../get-business";
import mockBusinessDetails from './../../../../../../mockData/mockBusinessDetails.json';
import { Business, IBusiness } from "../../../api/Business";
import { API_NOT_AUTHENTICATED_ERROR } from "../../../api/shared";

describe('BusinessDetailsCore', () => {
  it('should display loading state correclty', async () => {
    const page = await newSpecPage({
      components: [BusinessDetailsCore],
      template: () => <business-details-core />,
    });

    await page.waitForChanges();

    expect(page.root).toMatchSnapshot();
  });

  it('should display error state correctly', async () => {
    const getBusiness = makeGetBusiness({
      id: '',
      authToken: '',
      service: {
        fetchBusiness: async () => ({ error: 'error' }),
      },
    });

    const page = await newSpecPage({
      components: [BusinessDetailsCore],
      template: () => <business-details-core getBusiness={getBusiness} />,
    });

    await page.waitForChanges();

    expect(page.root).toMatchSnapshot();
  });

  it('should set business details correctly to state', async () => {
    const getBusiness = makeGetBusiness({
      id: '',
      authToken: '',
      service: {
        fetchBusiness: async () => Promise.resolve(mockBusinessDetails),
      },
    });

    const page = await newSpecPage({
      components: [BusinessDetailsCore],
      template: () => <business-details-core getBusiness={getBusiness} />,
    });

    await page.waitForChanges();

    const expectedBusiness = new Business(mockBusinessDetails.data as unknown as IBusiness);
    expect(page.rootInstance.business).toEqual(expectedBusiness);
    expect(page.root).toMatchSnapshot();
  });

  it('should emit error event when fetch fails', async () => {
    const getBusiness = makeGetBusiness({
      authToken: 'abc',
      id: 'abc',
      service: {
        fetchBusiness: jest.fn().mockRejectedValue(new Error('Fetch error')),
      },
    })

    const errorSpy = jest.fn();

    const page = await newSpecPage({
      components: [BusinessDetailsCore],
      template: () => <business-details-core getBusiness={getBusiness} onError-event={errorSpy} />,
    });

    await page.waitForChanges();

    expect(errorSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        detail: {
          errorCode: 'fetch-error',
          message: 'Fetch error',
          severity: 'error',
        }
      })
    );
  });

  it('should emit error event when API returns error', async () => {
    const getBusiness = makeGetBusiness({
      authToken: 'abc',
      id: 'abc',
      service: {
        fetchBusiness: jest.fn().mockResolvedValue(API_NOT_AUTHENTICATED_ERROR),
      },
    })

    const errorSpy = jest.fn();

    const page = await newSpecPage({
      components: [BusinessDetailsCore],
      template: () => <business-details-core getBusiness={getBusiness} onError-event={errorSpy} />,
    });

    await page.waitForChanges();

    expect(errorSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        detail: {
          errorCode: 'not-authenticated',
          message: 'Not Authenticated',
          severity: 'error',
        }
      })
    );
  });
});

