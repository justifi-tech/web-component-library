jest.mock('chart.js', () => ({
  Chart: class {
    static register() {}
  },
  BarController: {},
  BarElement: {},
  CategoryScale: {},
  LinearScale: {},
  Legend: {},
  Tooltip: {},
  Title: {},
  Colors: {},
}));

import { h } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';
import { JustifiGrossPaymentChart } from '../justifi-gross-payment-chart';
import { ReportsService } from '../../../api/services/reports.service';
import { API_NOT_AUTHENTICATED_ERROR } from '../../../api/shared';
import JustifiAnalytics from '../../../api/Analytics';
import { GrossVolumeReport } from '../../../api/GrossVolume';
import { IApiResponse } from '../../../api';
import mockSuccessResponse from '../../../../../../mockData/mockGrossVolumeReportSuccess.json';

jest.mock('../../../api/services/reports.service');

const mockDataResponse = mockSuccessResponse as IApiResponse<GrossVolumeReport>;

beforeEach(() => {
  // @ts-ignore
  JustifiAnalytics.prototype.trackCustomEvents = jest.fn();
});

describe('JustifiGrossPaymentChart', () => {
  it('renders an error when no accountId and authToken is passed', async () => {
    const page = await newSpecPage({
      components: [JustifiGrossPaymentChart],
      template: () => <justifi-gross-payment-chart accountId="" authToken="" />,
    });

    await page.waitForChanges();
    expect(page.root).toMatchSnapshot();
  });

  it('renders an error when no accountId is passed', async () => {
    const page = await newSpecPage({
      components: [JustifiGrossPaymentChart],
      template: () => <justifi-gross-payment-chart authToken="abc" accountId="" />,
    });

    await page.waitForChanges();
    expect(page.root).toMatchSnapshot();
  });

  it('renders an error when no authToken is passed', async () => {
    const page = await newSpecPage({
      components: [JustifiGrossPaymentChart],
      template: () => <justifi-gross-payment-chart accountId="abc" authToken="" />,
    });

    await page.waitForChanges();
    expect(page.root).toMatchSnapshot();
  });

  it('emits an error event when no accountId and authToken is passed', async () => {
    const errorEvent = jest.fn();
    const page = await newSpecPage({
      components: [JustifiGrossPaymentChart],
      template: () => <justifi-gross-payment-chart onError-event={errorEvent} accountId="" authToken="" />,
    });

    await page.waitForChanges();
    expect(errorEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        detail: {
          errorCode: 'missing-props',
          message: 'Account ID and Auth Token are required',
          severity: 'error',
        },
      }),
    );
  });

  it('emits an error event when fetch fails', async () => {
    ReportsService.prototype.fetchGrossVolumeChartData = jest.fn().mockReturnValue(API_NOT_AUTHENTICATED_ERROR);

    const errorEvent = jest.fn();

    const page = await newSpecPage({
      components: [JustifiGrossPaymentChart],
      template: () => (
        <justifi-gross-payment-chart accountId="abc" authToken="abc" onError-event={errorEvent} />
      ),
    });

    await page.waitForChanges();

    expect(errorEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        detail: {
          errorCode: 'not-authenticated',
          message: 'Not Authenticated',
          severity: 'error',
        },
      }),
    );
  });

  it('emits an error event when error occurs', async () => {
    ReportsService.prototype.fetchGrossVolumeChartData = jest.fn().mockRejectedValue(new Error('Network error'));

    const errorEvent = jest.fn();

    const page = await newSpecPage({
      components: [JustifiGrossPaymentChart],
      template: () => (
        <justifi-gross-payment-chart accountId="abc" authToken="abc" onError-event={errorEvent} />
      ),
    });

    await page.waitForChanges();

    expect(errorEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        detail: {
          errorCode: 'fetch-error',
          message: 'Network error',
          severity: 'error',
        },
      }),
    );
  });
});

describe('justifi-gross-payment-chart chart behavior', () => {
  it('should initialize with default states', async () => {
    ReportsService.prototype.fetchGrossVolumeChartData = jest.fn(() => new Promise(() => {}));

    const page = await newSpecPage({
      components: [JustifiGrossPaymentChart],
      template: () => <justifi-gross-payment-chart accountId="id" authToken="tok" />,
    });
    await page.waitForChanges();
    expect(page.rootInstance.loading).toBeTruthy();
    expect(page.rootInstance.errorMessage).toBe('');
  });

  it('updates the state properly', async () => {
    ReportsService.prototype.fetchGrossVolumeChartData = jest.fn().mockResolvedValue(mockDataResponse);

    const page = await newSpecPage({
      components: [JustifiGrossPaymentChart],
      template: () => <justifi-gross-payment-chart accountId="my-account-id" authToken="my-token" />,
    });

    await page.waitForChanges();

    expect(page.rootInstance.grossVolumeReport).toEqual(mockDataResponse.data);
  });

  it('matches the snapshot when in loading state', async () => {
    ReportsService.prototype.fetchGrossVolumeChartData = jest.fn(() => new Promise(() => {}));

    const page = await newSpecPage({
      components: [JustifiGrossPaymentChart],
      template: () => <justifi-gross-payment-chart accountId="id" authToken="tok" />,
    });

    expect(page.root).toMatchSnapshot();
  });

  it('matches the snapshot when in error state', async () => {
    ReportsService.prototype.fetchGrossVolumeChartData = jest.fn().mockRejectedValue('Error message');

    const page = await newSpecPage({
      components: [JustifiGrossPaymentChart],
      template: () => <justifi-gross-payment-chart accountId="my-account-id" authToken="my-token" />,
    });

    await page.waitForChanges();

    expect(page.root).toMatchSnapshot();
  });

  it('emits an error event when error occurs', async () => {
    ReportsService.prototype.fetchGrossVolumeChartData = jest.fn().mockRejectedValue('Error message');

    const eventSpy = jest.fn();

    const page = await newSpecPage({
      components: [JustifiGrossPaymentChart],
      template: () => (
        <justifi-gross-payment-chart
          accountId="my-account-id"
          authToken="my-token"
          onError-event={eventSpy}
        />
      ),
    });

    await page.waitForChanges();

    expect(eventSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        detail: {
          errorCode: 'fetch-error',
          message: 'Error message',
          severity: 'error',
        },
      }),
    );
  });

  it('emits an error event when API return error', async () => {
    ReportsService.prototype.fetchGrossVolumeChartData = jest.fn().mockResolvedValue(API_NOT_AUTHENTICATED_ERROR);

    const eventSpy = jest.fn();

    const page = await newSpecPage({
      components: [JustifiGrossPaymentChart],
      template: () => (
        <justifi-gross-payment-chart
          accountId="my-account-id"
          authToken="my-token"
          onError-event={eventSpy}
        />
      ),
    });

    await page.waitForChanges();

    expect(eventSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        detail: {
          errorCode: 'not-authenticated',
          message: 'Not Authenticated',
          severity: 'error',
        },
      }),
    );
  });
});
