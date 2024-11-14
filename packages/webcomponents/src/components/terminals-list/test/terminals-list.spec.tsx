import { h } from "@stencil/core";
import { newSpecPage } from "@stencil/core/testing";
import { TerminalsList } from "../terminals-list";
import { TerminalsListCore } from "../terminals-list-core";
import { TerminalService } from '../../../api/services/terminal.service';
import JustifiAnalytics from "../../../api/Analytics";
jest.mock('../../../api/services/terminal.service');

beforeEach(() => {
  // Bypass Analytics to avoid errors. Analytics attaches events listeners to HTML elements
  // which are not available in Jest/node environment
  // @ts-ignore
  JustifiAnalytics.prototype.trackCustomEvents = jest.fn();
});

describe('terminals-list', () => {
  it('renders an error message when accountId and authToken are not provided', async () => {
    const page = await newSpecPage({
      components: [TerminalsList, TerminalsListCore],
      template: () => <justifi-terminals-list />,
    });
    await page.waitForChanges();
    expect(page.root).toMatchSnapshot();
  });

  it('renders an error message when accountId is not provided', async () => {
    const page = await newSpecPage({
      components: [TerminalsList, TerminalsListCore],
      template: () => <justifi-terminals-list auth-token="abc" />,
    });
    await page.waitForChanges();
    expect(page.root).toMatchSnapshot();
  });

  it('renders an error message when authToken is not provided', async () => {
    const page = await newSpecPage({
      components: [TerminalsList, TerminalsListCore],
      template: () => <justifi-terminals-list account-id="abc" />,
    });
    await page.waitForChanges();
    expect(page.root).toMatchSnapshot();
  });

  it('emit an error event when accountId and authToken are not provided', async () => {
    const errorEvent = jest.fn();
    const page = await newSpecPage({
      components: [TerminalsList, TerminalsListCore],
      template: () => <justifi-terminals-list onError-event={errorEvent} />,
    });
    await page.waitForChanges();
    expect(errorEvent).toHaveBeenCalled();
  });

  it('emit an error event when fetch fails', async () => {
    TerminalService.prototype.fetchTerminals = jest.fn().mockRejectedValue(new Error('Fetch error'));

    const errorEvent = jest.fn();
    const page = await newSpecPage({
      components: [TerminalsList, TerminalsListCore],
      template: () => (
        <justifi-terminals-list
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
