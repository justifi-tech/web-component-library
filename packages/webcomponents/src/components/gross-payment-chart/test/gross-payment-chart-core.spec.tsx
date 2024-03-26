import { h } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';
import { GrossPaymentChartCore } from '../gross-payment-chart-core';
import { GrossVolumeReport } from '../../../api/GrossVolume';
import { IApiResponse } from '../../../api';
import mockSuccessResponse from '../../../api/mockResponses/mockGrossVolumeReportSuccess.json';
import { makeGetGrossPaymentChartData } from '../get-gross-payment-chart-data';

const mockDataResponse = mockSuccessResponse as IApiResponse<GrossVolumeReport>

// To prevent this error https://github.com/reactchartjs/react-chartjs-2/issues/155
jest.mock('chart.js', () => ({
  Chart: () => null,
}))

describe('gross-payment-chart', () => {
  it('should initialize with default states', async () => {
    const page = await newSpecPage({
      components: [GrossPaymentChartCore],
      html: `<gross-payment-chart-core />`,
    });
    expect(page.rootInstance.loading).toBeTruthy();
    expect(page.rootInstance.errorMessage).toBe('');
  });

  it('updates the state properly', async () => {
    const mockGetSuccessResponse = {
      fetchGrossVolumeChartData: jest.fn().mockResolvedValue(mockDataResponse)
    };

    const getGrossPayment = makeGetGrossPaymentChartData({
      id: 'my-account-id',
      authToken: 'my-token',
      service: mockGetSuccessResponse
    });

    const page = await newSpecPage({
      components: [GrossPaymentChartCore],
      html: `<gross-payment-chart-core />`,
    });

    page.rootInstance.componentWillLoad = () => { };
    page.rootInstance.getGrossPayment = getGrossPayment;
    page.rootInstance.fetchData();
    await page.waitForChanges();

    expect(page.rootInstance.grossVolumeReport).toEqual(mockDataResponse.data);
  });

  it('matches the snapshot when in loading state', async () => {
    const page = await newSpecPage({
      components: [GrossPaymentChartCore],
      html: `<gross-payment-chart-core></gross-payment-chart-core>`,
    });

    expect(page.root).toMatchSnapshot();
  });

  // tests error state
  it('matches the snapshot when in error state', async () => {
    const getGrossPayment = makeGetGrossPaymentChartData({
      id: 'my-account-id',
      authToken: 'my-token',
      service: {
        fetchGrossVolumeChartData: jest.fn().mockRejectedValue('Error message')
      }
    });

    const page = await newSpecPage({
      components: [GrossPaymentChartCore],
      html: `<gross-payment-chart-core></gross-payment-chart-core>`,
    });

    page.rootInstance.componentWillLoad = () => { };
    page.rootInstance.getGrossPayment = getGrossPayment;
    page.rootInstance.fetchData();
    await page.waitForChanges();

    expect(page.root).toMatchSnapshot();
  });

  it('emits errorEvent when error occurs', async () => {
    const getGrossPayment = makeGetGrossPaymentChartData({
      id: 'my-account-id',
      authToken: 'my-token',
      service: {
        fetchGrossVolumeChartData: jest.fn().mockRejectedValue('Not Authorized')
      }
    });
    const errorEvent = jest.fn();

    const page = await newSpecPage({
      components: [GrossPaymentChartCore],
      template: () => <gross-payment-chart-core getGrossPayment={getGrossPayment} onErrorEvent={errorEvent} />,
    });

    page.rootInstance.componentWillLoad = () => { };
    page.rootInstance.fetchData();
    await page.waitForChanges();
    expect(errorEvent).toHaveBeenCalledWith(
      expect.objectContaining({ detail: 'Not Authorized' })
    );
  });
});
