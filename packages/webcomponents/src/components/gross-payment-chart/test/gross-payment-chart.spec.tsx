import { h } from "@stencil/core";
import { newSpecPage } from "@stencil/core/testing";
import { GrossPaymentChart } from "../gross-payment-chart";
import { GrossPaymentChartCore } from "../gross-payment-chart-core";
import { ReportsService } from "../../../api/services/reports.service";
jest.mock("../../../api/services/reports.service");

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
      template: () => <justifi-gross-payment-chart onErrorEvent={errorEvent} />,
    });

    await page.waitForChanges();
    expect(errorEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        detail: {
          errorCode: 'missing-props',
          message: 'Account ID and Auth Token are required',
        }
      })
    );
  });

  it('emits an error event when fetch fails', async () => {
    ReportsService.prototype.fetchGrossVolumeChartData = jest.fn().mockReturnValue({
      "error": {
        "code": "not_authenticated",
        "message": "Not Authenticated"
      }
    });

    const errorEvent = jest.fn();

    const page = await newSpecPage({
      components: [GrossPaymentChart, GrossPaymentChartCore],
      template: () => (
        <justifi-gross-payment-chart
          account-id="abc"
          auth-token="abc"
          onErrorEvent={errorEvent}
        />
      ),
    });

    await page.waitForChanges();

    expect(errorEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        detail: {
          errorCode: 'fetch-error',
          message: 'Not Authenticated',
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
          onErrorEvent={errorEvent}
        />
      ),
    });

    await page.waitForChanges();

    expect(errorEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        detail: {
          errorCode: 'fetch-error',
          message: 'Network error',
        }
      })
    );
  });
});
