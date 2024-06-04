import { h } from "@stencil/core";
import { newSpecPage } from "@stencil/core/testing";
import { GrossPaymentChart } from "../gross-payment-chart";
import { GrossPaymentChartCore } from "../gross-payment-chart-core";
import { ReportsService } from "../../../api/services/reports.service";
import { API_NOT_AUTHENTICATED_ERROR } from "../../../api/shared";
import JustifiAnalytics from "../../../api/Analytics";
jest.mock("../../../api/services/reports.service");

beforeEach(() => {
  // Bypass Analytics to avoid errors. Analytics attaches events listeners to HTML elements
  // which are not available in Jest/node environment
  // @ts-ignore
  JustifiAnalytics.prototype.trackCustomEvents = jest.fn();
});

describe('GrossPaymentChart', () => {
  it('renders an error when no accountId and authToken is passed', async () => {
    const page = await newSpecPage({
      components: [GrossPaymentChart, GrossPaymentChartCore],
      template: () => <justifi-gross-payment-chart />,
    });

    await page.waitForChanges();
    expect(page.root).toMatchSnapshot();
  });

  it('renders an error when no accountId is passed', async () => {
    const page = await newSpecPage({
      components: [GrossPaymentChart, GrossPaymentChartCore],
      template: () => <justifi-gross-payment-chart auth-token="abc" />,
    });

    await page.waitForChanges();
    expect(page.root).toMatchSnapshot();
  });

  it('renders an error when no authToken is passed', async () => {
    const page = await newSpecPage({
      components: [GrossPaymentChart, GrossPaymentChartCore],
      template: () => <justifi-gross-payment-chart account-id="abc" />,
    });

    await page.waitForChanges();
    expect(page.root).toMatchSnapshot();
  });

  it('emits an error event when no accountId and authToken is passed', async () => {
    const errorEvent = jest.fn();
    const page = await newSpecPage({
      components: [GrossPaymentChart, GrossPaymentChartCore],
      template: () => <justifi-gross-payment-chart onError-event={errorEvent} />,
    });

    await page.waitForChanges();
    expect(errorEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        detail: {
          errorCode: 'missing-props',
          message: 'Account ID and Auth Token are required',
          severity: 'error',
        }
      })
    );
  });

  it('emits an error event when fetch fails', async () => {
    ReportsService.prototype.fetchGrossVolumeChartData = jest.fn().mockReturnValue(API_NOT_AUTHENTICATED_ERROR);

    const errorEvent = jest.fn();

    const page = await newSpecPage({
      components: [GrossPaymentChart, GrossPaymentChartCore],
      template: () => (
        <justifi-gross-payment-chart
          account-id="abc"
          auth-token="abc"
          onError-event={errorEvent}
        />
      ),
    });

    await page.waitForChanges();

    expect(errorEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        detail: {
          errorCode: 'not-authenticated',
          message: 'Not Authenticated',
          severity: 'error',
        }
      })
    );
  });

  it('emits an error event when error occurs', async () => {
    ReportsService.prototype.fetchGrossVolumeChartData = jest.fn()
      .mockRejectedValue(new Error('Network error'));

    const errorEvent = jest.fn();

    const page = await newSpecPage({
      components: [GrossPaymentChart, GrossPaymentChartCore],
      template: () => (
        <justifi-gross-payment-chart
          account-id="abc"
          auth-token="abc"
          onError-event={errorEvent}
        />
      ),
    });

    await page.waitForChanges();

    expect(errorEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        detail: {
          errorCode: 'fetch-error',
          message: 'Network error',
          severity: 'error',
        }
      })
    );
  });
});
