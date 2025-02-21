import { h } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';
import { OrderTerminals } from '../order-terminals';
import JustifiAnalytics from '../../../api/Analytics';
import { BusinessService } from '../../../api/services/business.service';
import { TerminalService } from '../../../api/services/terminal.service';
import businessDetailsMock from '../../../../../../mockData/mockBusinessDetails.json';
import { TerminalQuantitySelector } from '../../terminal-quantity-selector/terminal-quantity-selector';

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

  it('should call TerminalsService.fetchTerminalModels on component load', async () => {
    TerminalService.prototype.fetchTerminalModels = jest.fn().mockResolvedValue([]);

    const page = await newSpecPage({
      components: [OrderTerminals],
      template: () => <justifi-order-terminals businessId='123' authToken='123' />
    });

    await page.rootInstance.componentWillLoad();

    expect(TerminalService.prototype.fetchTerminalModels).toHaveBeenCalled();
  });

  it('should display an error message if getTerminals fails', async () => {
    TerminalService.prototype.fetchTerminalModels = jest.fn().mockResolvedValue({
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

  it('should emit an error event if getTerminals fails', async () => {
    TerminalService.prototype.fetchTerminalModels = jest.fn().mockResolvedValue({
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

  it('should set terminalModels state with the correct data structure', async () => {
    TerminalService.prototype.fetchTerminalModels = jest.fn().mockResolvedValue({
      data: {
        terminal_models: [
          {
            id: '1',
            model_name: 'Model 1',
            description: 'Description 1',
            image_url: 'Image URL 1',
            help_url: 'Help URL 1',
          },
          {
            id: '2',
            model_name: 'Model 2',
            description: 'Description 2',
            image_url: 'Image URL 2',
            help_url: 'Help URL 2',
          }
        ],
        order_limit: 5
      }
    });

    const page = await newSpecPage({
      components: [OrderTerminals],
      template: () => <justifi-order-terminals businessId="123" authToken="123" />,
    });

    await page.rootInstance.componentWillLoad();
    await page.waitForChanges();

    expect(page.rootInstance.terminalModels).toEqual([
      {
        id: '1',
        model_name: 'Model 1',
        description: 'Description 1',
        image_url: 'Image URL 1',
        help_url: 'Help URL 1',
      },
      {
        id: '2',
        model_name: 'Model 2',
        description: 'Description 2',
        image_url: 'Image URL 2',
        help_url: 'Help URL 2',
      }
    ]);
  });

  it('should display the terminals if getTerminals is successful', async () => {
    TerminalService.prototype.fetchTerminalModels = jest.fn().mockResolvedValue({
      data: {
        terminal_models: [
          {
            id: '1',
            model_name: 'Model 1',
            description: 'Description 1',
            image_url: 'Image URL 1',
            help_url: 'Help URL 1',
          },
          {
            id: '2',
            model_name: 'Model 2',
            description: 'Description 2',
            image_url: 'Image URL 2',
            help_url: 'Help URL 2',
          }
        ],
        order_limit: 5
      }
    });

    const page = await newSpecPage({
      components: [OrderTerminals],
      template: () => <justifi-order-terminals businessId="123" authToken="123" />,
    });

    await page.waitForChanges();

    expect(page.root).toMatchSnapshot();
  });

  it('should update totalQuantity state when add a terminal is clicked 3 times', async () => {
    TerminalService.prototype.fetchTerminalModels = jest.fn().mockResolvedValue({
      data: {
        terminal_models: [
          {
            id: '1',
            model_name: 'Model 1',
            description: 'Description 1',
            image_url: 'Image URL 1',
            help_url: 'Help URL 1',
          },
          {
            id: '2',
            model_name: 'Model 2',
            description: 'Description 2',
            image_url: 'Image URL 2',
            help_url: 'Help URL 2',
          }
        ],
        order_limit: 5
      }
    });

    const page = await newSpecPage({
      components: [OrderTerminals, TerminalQuantitySelector],
      template: () => <justifi-order-terminals businessId="123" authToken="123" />,
    });

    await page.waitForChanges();

    const terminals = page.root.shadowRoot.querySelectorAll('terminal-quantity-selector');
    const terminal1AddUnity = (terminals[0].querySelector('.plus') as HTMLElement);
    const terminal2AddUnity = (terminals[1].querySelector('.plus') as HTMLElement);

    terminal1AddUnity.click();
    terminal1AddUnity.click();
    terminal2AddUnity.click();

    expect(page.rootInstance.order.totalQuantity).toBe(3);
  });

  it('should update totalQuantity state when add a terminal is clicked 4 times', async () => {
    TerminalService.prototype.fetchTerminalModels = jest.fn().mockResolvedValue({
      data: {
        terminal_models: [
          {
            id: '1',
            model_name: 'Model 1',
            description: 'Description 1',
            image_url: 'Image URL 1',
            help_url: 'Help URL 1',
          },
          {
            id: '2',
            model_name: 'Model 2',
            description: 'Description 2',
            image_url: 'Image URL 2',
            help_url: 'Help URL 2',
          }
        ],
        order_limit: 5
      }
    });

    const page = await newSpecPage({
      components: [OrderTerminals, TerminalQuantitySelector],
      template: () => <justifi-order-terminals businessId="123" authToken="123" />,
    });

    await page.waitForChanges();

    const terminals = page.root.shadowRoot.querySelectorAll('terminal-quantity-selector');
    const terminal1AddUnity = (terminals[0].querySelector('.plus') as HTMLElement);

    terminal1AddUnity.click();
    terminal1AddUnity.click();
    terminal1AddUnity.click();
    terminal1AddUnity.click();

    expect(page.rootInstance.order.totalQuantity).toBe(4);
  });

  it('should call TerminalService.orderTerminals once submit button is clicked', async () => {
    TerminalService.prototype.orderTerminals = jest.fn().mockResolvedValue({});
    TerminalService.prototype.fetchTerminalModels = jest.fn().mockResolvedValue({
      data: {
        terminal_models: [
          {
            id: '1',
            model_name: 'Model 1',
            description: 'Description 1',
            image_url: 'Image URL 1',
            help_url: 'Help URL 1',
          },
          {
            id: '2',
            model_name: 'Model 2',
            description: 'Description 2',
            image_url: 'Image URL 2',
            help_url: 'Help URL 2',
          }
        ],
        order_limit: 5
      }
    });

    const page = await newSpecPage({
      components: [OrderTerminals, TerminalQuantitySelector],
      template: () => <justifi-order-terminals accountId="123" businessId="123" authToken="123" />,
    });

    await page.waitForChanges();

    const terminals = page.root.shadowRoot.querySelectorAll('terminal-quantity-selector');
    const terminal1AddUnity = (terminals[0].querySelector('.plus') as HTMLElement);

    terminal1AddUnity.click();

    const submitButton = page.root.shadowRoot.querySelector('.submit-btn') as HTMLElement;
    submitButton.click();

    await page.waitForChanges();

    expect(TerminalService.prototype.orderTerminals).toHaveBeenCalledWith("123", { "account_id": "123", "business_id": "123", "order_items": [{ "model_name": "Model 1", "quantity": 1 }], "order_type": undefined, "provider": "verifone" });
  });
});
