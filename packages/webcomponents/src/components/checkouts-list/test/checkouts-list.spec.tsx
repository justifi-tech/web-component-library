import { h } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';
import { CheckoutsList } from '../checkouts-list';
import { CheckoutsListCore } from '../checkouts-list-core';
import { CheckoutService } from '../../../api/services/checkout.service';
import JustifiAnalytics from '../../../api/Analytics';
jest.mock('../../../api/services/checkout.service');

beforeEach(() => {
  // Bypass Analytics to avoid errors. Analytics attaches events listeners to HTML elements
  // which are not available in Jest/node environment
  // @ts-ignore
  JustifiAnalytics.prototype.trackCustomEvents = jest.fn();
});

describe('checkouts-list', () => {
  it('renders an error message when accountId and authToken are not provided', async () => {
    const page = await newSpecPage({
      components: [CheckoutsList, CheckoutsListCore],
      template: () => <justifi-checkouts-list />,
    });
    await page.waitForChanges();
    expect(page.root).toMatchSnapshot();
  });

  it('renders an error message when accountId is not provided', async () => {
    const page = await newSpecPage({
      components: [CheckoutsList, CheckoutsListCore],
      template: () => <justifi-checkouts-list auth-token="abc" />,
    });
    await page.waitForChanges();
    expect(page.root).toMatchSnapshot();
  });

  it('renders an error message when authToken is not provided', async () => {
    const page = await newSpecPage({
      components: [CheckoutsList, CheckoutsListCore],
      template: () => <justifi-checkouts-list account-id="abc" />,
    });
    await page.waitForChanges();
    expect(page.root).toMatchSnapshot();
  });

  it('emit an error event when accountId and authToken are not provided', async () => {
    const errorEvent = jest.fn();
    const page = await newSpecPage({
      components: [CheckoutsList, CheckoutsListCore],
      template: () => <justifi-checkouts-list onError-event={errorEvent} />,
    });
    await page.waitForChanges();
    expect(errorEvent).toHaveBeenCalled();
  });

  it('emit an error event when fetch fails', async () => {
    CheckoutService.prototype.fetchCheckouts = jest.fn().mockRejectedValue(new Error('Fetch error'));

    const errorEvent = jest.fn();
    const page = await newSpecPage({
      components: [CheckoutsList, CheckoutsListCore],
      template: () => (
        <justifi-checkouts-list
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
