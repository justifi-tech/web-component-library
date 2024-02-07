import { newSpecPage } from '@stencil/core/testing';
import { GrossPaymentChartCore } from '../gross-payment-chart-core';
import { GrossVolumeReport } from '../../../api/GrossVolume';
import { MockChartDataService } from './MockChartDataService';
import { IApiResponse } from '../../../api';
import mockSuccessResponse from '../../../api/mockResponses/mockGrossVolumeReportSuccess.json';

const mockDataResponse = mockSuccessResponse as IApiResponse<GrossVolumeReport>

describe('gross-payment-chart', () => {
  it('renders properly', async () => {
    const mockDataService = new MockChartDataService({ fetchChartDataResponse: mockDataResponse});
    const page = await newSpecPage({
      components: [GrossPaymentChartCore],
      html: `
        <gross-payment-chart-core
          accountid='acc_123'
          auth-token='my-token'
        >
        </gross-payment-chart-core>
        `,
    });

    page.root.dataService = mockDataService;

    await page.waitForChanges();

    const chart = page.root.shadowRoot;
    expect(chart).toBeTruthy();
  });

  it('renders an error state when no account id is passed', async () => {
    const mockDataService = new MockChartDataService({ fetchChartDataResponse: mockDataResponse });
    const page = await newSpecPage({
      components: [GrossPaymentChartCore],
      html: `
        <gross-payment-chart-core
          auth-token='my-token'
        >
        </gross-payment-chart-core>
        `,
    });

    page.root.dataService = mockDataService;

    await page.waitForChanges();

    const chart = page.root.shadowRoot;

    const error = chart.querySelector('div').innerHTML.includes('Can not fetch any data without an AccountID and an AuthToken');
    expect(error).toBeTruthy();
    });
});
