import { h } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';
import { GrossPaymentChartCore } from '../gross-payment-chart-core';
import { GrossVolumeReport } from '../../../api/GrossVolume';
import { IApiResponse } from '../../../api';
import mockSuccessResponse from '../../../../../../mockData/mockGrossVolumeReportSuccess.json';
import { makeGetGrossPaymentChartData } from '../../../actions/gross-payment/get-gross-payment-chart-data';
import { API_NOT_AUTHENTICATED_ERROR } from '../../../api/shared';

const mockDataResponse = mockSuccessResponse as IApiResponse<GrossVolumeReport>

// To prevent this error https://github.com/reactchartjs/react-chartjs-2/issues/155
jest.mock('chart.js', () => ({
  Chart: () => null,
}))

describe('gross-payment-chart', () => {
  it('should initialize with default states', async () => {
    const page = await newSpecPage({
      components: [GrossPaymentChartCore],
      template: () => <gross-payment-chart-core />,
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
      template: () => <gross-payment-chart-core getGrossPayment={getGrossPayment} />,
    });

    await page.waitForChanges();

    expect(page.rootInstance.grossVolumeReport).toEqual(mockDataResponse.data);
  });

  it('matches the snapshot when in loading state', async () => {
    const page = await newSpecPage({
      components: [GrossPaymentChartCore],
      template: () => <gross-payment-chart-core />,
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
      template: () => <gross-payment-chart-core getGrossPayment={getGrossPayment} />,
    });

    await page.waitForChanges();

    expect(page.root).toMatchSnapshot();
  });

  it('emits an error event when error occurs', async () => {
    const getGrossPayment = makeGetGrossPaymentChartData({
      id: 'my-account-id',
      authToken: 'my-token',
      service: {
        fetchGrossVolumeChartData: jest.fn().mockRejectedValue('Error message')
      }
    });

    const eventSpy = jest.fn();

    const page = await newSpecPage({
      components: [GrossPaymentChartCore],
      template: () => <gross-payment-chart-core getGrossPayment={getGrossPayment} onError-event={eventSpy} />,
    });

    await page.waitForChanges();

    expect(eventSpy).toHaveBeenCalledWith(expect.objectContaining({
      detail: {
        errorCode: 'fetch-error',
        message: 'Error message',
        severity: 'error',
      }
    }));
  });

  it('emits an error event when API return error', async () => {
    const getGrossPayment = makeGetGrossPaymentChartData({
      id: 'my-account-id',
      authToken: 'my-token',
      service: {
        fetchGrossVolumeChartData: jest.fn().mockResolvedValue(API_NOT_AUTHENTICATED_ERROR)
      }
    });

    const eventSpy = jest.fn();

    const page = await newSpecPage({
      components: [GrossPaymentChartCore],
      template: () => <gross-payment-chart-core getGrossPayment={getGrossPayment} onError-event={eventSpy} />,
    });

    await page.waitForChanges();

    expect(eventSpy).toHaveBeenCalledWith(expect.objectContaining({
      detail: {
        errorCode: 'not-authenticated',
        message: 'Not Authenticated',
        severity: 'error',
      }
    }));
  })
});
