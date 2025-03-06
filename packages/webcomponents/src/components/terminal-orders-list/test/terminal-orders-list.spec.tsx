import { h } from "@stencil/core";
import { newSpecPage } from "@stencil/core/testing";
import { TerminalOrdersList } from "../terminal-orders-list";
import { TerminalOrdersListCore } from "../terminal-orders-list-core";
import { TerminalOrderService } from '../../../api/services/terminal_orders.service';
import JustifiAnalytics from "../../../api/Analytics";
jest.mock('../../../api/services/terminal_orders.service');

beforeEach(() => {
  // Bypass Analytics to avoid errors. Analytics attaches events listeners to HTML elements
  // which are not available in Jest/node environment
  // @ts-ignore
  JustifiAnalytics.prototype.trackCustomEvents = jest.fn();
});

describe('terminals-list', () => {
  it('emit an error event when accountId and authToken are not provided', async () => {
    const errorEvent = jest.fn();
    const page = await newSpecPage({
      components: [TerminalOrdersList, TerminalOrdersListCore],
      template: () => <justifi-terminal-orders-list onError-event={errorEvent} />,
    });
    await page.waitForChanges();
    expect(errorEvent).toHaveBeenCalled();
  });

  it('emit an error event when fetch fails', async () => {
    TerminalOrderService.prototype.fetchTerminalOrders = jest.fn().mockRejectedValue(new Error('Fetch error'));

    const errorEvent = jest.fn();
    const page = await newSpecPage({
      components: [TerminalOrdersList, TerminalOrdersListCore],
      template: () => (
        <justifi-terminal-orders-list
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
          message: 'Fetch error',
          severity: 'error',
        }
      })
    );
  });
});
