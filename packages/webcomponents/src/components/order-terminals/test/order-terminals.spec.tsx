import { h } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';
import { OrderTerminals } from '../order-terminals';
import JustifiAnalytics from '../../../api/Analytics';
import { BusinessService } from '../../../api/services/business.service';
import businessDetailsMock from '../../../../../../mockData/mockBusinessDetails.json';

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

  it('should display an error message if getBusiness fails', async () => {
    BusinessService.prototype.fetchBusiness = jest.fn().mockResolvedValue({
      "error": {
        "code": "resource_not_found",
        "message": "Resource Not Found"
      }
    });

    const page = await newSpecPage({
      components: [OrderTerminals],
      template: () => <justifi-order-terminals businessId="123" authToken="123" />,
    });

    await page.waitForChanges();

    expect(page.root).toMatchSnapshot();
  });

  it('should emit an error event if getBusiness fails', async () => {
    BusinessService.prototype.fetchBusiness = jest.fn().mockResolvedValue({
      "error": {
        "code": "resource_not_found",
        "message": "Resource Not Found"
      }
    });

    const errorEvent = jest.fn();
    const page = await newSpecPage({
      components: [OrderTerminals],
      template: () => <justifi-order-terminals businessId="123" authToken="123" onerror-event={errorEvent} />,
    });

    await page.waitForChanges();

    expect(errorEvent).toHaveBeenCalled();
  });

  it('should display the business details if getBusiness is successful', async () => {
    BusinessService.prototype.fetchBusiness = jest.fn().mockResolvedValue(businessDetailsMock);

    const page = await newSpecPage({
      components: [OrderTerminals],
      template: () => <justifi-order-terminals businessId="123" authToken="123" />,
    });

    await page.waitForChanges();

    expect(page.root).toMatchSnapshot();
  });

  it('should display a skeleton for each terminal while loading', async () => {
    BusinessService.prototype.fetchBusiness = jest.fn().mockResolvedValue(businessDetailsMock);

    const page = await newSpecPage({
      components: [OrderTerminals],
      template: () => <justifi-order-terminals businessId="123" authToken="123" />,
    });

    await page.waitForChanges();

    expect(page.root).toMatchSnapshot();

  });

  it('should call getTerminals on component load', async () => { });

  it('should display an error message if getTerminals fails', async () => { });

  it('should emit an error event if getTerminals fails', async () => { });

  it('should display the terminals if getTerminals is successful', async () => { });

  it('should update the selected terminals state when add a terminal is clicked', async () => { });
});
