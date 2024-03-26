import { h } from "@stencil/core";
import { newSpecPage } from "@stencil/core/testing";
import { GrossPaymentChart } from "../gross-payment-chart";
import { GrossPaymentChartCore } from "../gross-payment-chart-core";
import { ReportsService } from "../../../api/services/reports.service";

describe('GrossPaymentChart', () => {
  it('renders an error when no accountId and authToken is passed', async () => {
    const page = await newSpecPage({
      components: [GrossPaymentChart, GrossPaymentChartCore],
      html: '<justifi-gross-payment-chart></justifi-gross-payment-chart>',
    });

    await page.waitForChanges();
    expect(page.root).toMatchSnapshot();
  });

  it('renders an error when no accountId is passed', async () => {
    const page = await newSpecPage({
      components: [GrossPaymentChart, GrossPaymentChartCore],
      html: '<justifi-gross-payment-chart auth-token="abc"></justifi-gross-payment-chart>',
    });

    await page.waitForChanges();
    expect(page.root).toMatchSnapshot();
  });

  it('renders an error when no authToken is passed', async () => {
    const page = await newSpecPage({
      components: [GrossPaymentChart, GrossPaymentChartCore],
      html: '<justifi-gross-payment-chart account-id="abc"></justifi-gross-payment-chart>',
    });

    await page.waitForChanges();
    expect(page.root).toMatchSnapshot();
  });

  it('emits tokenExpired event when token expires', async () => {
    const fetchGrossVolumeChartDataSpy = jest.spyOn(ReportsService.prototype, 'fetchGrossVolumeChartData' as keyof ReportsService);

    fetchGrossVolumeChartDataSpy.mockResolvedValue({
      "error": {
        "code": "not_authenticated",
        "message": "Not Authenticated"
      }
    });

    const eventSpy = jest.fn();

    const page = await newSpecPage({
      components: [GrossPaymentChart, GrossPaymentChartCore],
      template: () => <justifi-gross-payment-chart account-id="abc" auth-token="abc" onTokenExpired={eventSpy} />,
    });

    await page.waitForChanges();
    expect(eventSpy).toHaveBeenCalled();
  });
});
