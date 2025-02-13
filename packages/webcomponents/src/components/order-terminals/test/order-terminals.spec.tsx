import { h } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';
import { OrderTerminals } from '../order-terminals';
import JustifiAnalytics from '../../../api/Analytics';

beforeEach(() => {
  // Bypass Analytics to avoid errors. Analytics attaches events listeners to HTML elements
  // which are not available in Jest/node environment
  // @ts-ignore
  JustifiAnalytics.prototype.trackCustomEvents = jest.fn();
});

describe('justifi-order-terminals', () => {
  it('should instantiate JustifiAnalytics on componentWillLoad', async () => {
    const page = await newSpecPage({
      components: [OrderTerminals],
      template: () => <justifi-order-terminals />,
    });

    await page.rootInstance.componentWillLoad();

    expect(page.rootInstance.analytics).toBeInstanceOf(JustifiAnalytics);
  });

  it('should set error message if businessId or authToken is missing', async () => {
    const page = await newSpecPage({
      components: [OrderTerminals],
      template: () => <justifi-order-terminals />,
    });

    await page.rootInstance.componentWillLoad();

    expect(page.rootInstance.errorMessage).toBe('Invalid business id or auth token');
  });

  it('should emit an error event if businessId or authToken is missing', async () => {
    const errorEvent = jest.fn();
    const page = await newSpecPage({
      components: [OrderTerminals],
      template: () => <justifi-order-terminals onerror-event={errorEvent} />,
    });

    await page.rootInstance.componentWillLoad();

    expect(errorEvent).toHaveBeenCalled();
  });

  it('should display an skeleton loader while loading', async () => {
    const page = await newSpecPage({
      components: [OrderTerminals],
      template: () => <justifi-order-terminals />,
    });

    expect(page.root).toMatchSnapshot();
  });

  // it('should display an error message if getBusiness fails', async () => { });

  // it('should display the business details if getBusiness is successful', async () => { });
});
