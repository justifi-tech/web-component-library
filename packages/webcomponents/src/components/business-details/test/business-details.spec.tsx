import { h } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';
import { BusinessDetails } from '../business-details';
import { BusinessDetailsCore } from '../business-details-core';

describe('justifi-business-details', () => {
  it('initializes getBusiness on load with valid props', async () => {
    const page = await newSpecPage({
      components: [BusinessDetails],
      template: () => <justifi-business-details business-id="123" auth-token="token" />,
    });

    page.waitForChanges();

    expect(page.rootInstance.getBusiness).toBeDefined();
    expect(page.rootInstance.errorMessage).toBeUndefined();
  });

  it('sets an error message with invalid props', async () => {
    const page = await newSpecPage({
      components: [BusinessDetails],
      template: () => <justifi-business-details />, // No props provided
    });

    page.waitForChanges();

    expect(page.rootInstance.errorMessage).toBe('Invalid business id or auth token');
  });

  it('renders the error state when there is an error message', async () => {
    const page = await newSpecPage({
      components: [BusinessDetails, BusinessDetailsCore],
      template: () => <justifi-business-details />,
    });

    await page.waitForChanges();

    expect(page.rootInstance.errorMessage).toBe('Invalid business id or auth token');
    expect(page.root).toMatchSnapshot();
  });

  it('renders business-details-core when there is no error message', async () => {
    const page = await newSpecPage({
      components: [BusinessDetails, BusinessDetailsCore],
      template: () => <justifi-business-details business-id="123" auth-token="token" />,
    });

    page.waitForChanges();

    const core = page.root.shadowRoot.querySelector('business-details-core');
    expect(core).not.toBeNull();
  });

  it('emits an error event when there is no auth token', async () => {
    const errorSpy = jest.fn();

    const page = await newSpecPage({
      components: [BusinessDetails],
      template: () => <justifi-business-details business-id="123" onErrorEvent={errorSpy} />,
    });

    page.waitForChanges();

    expect(errorSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        detail: {
          errorCode: 'missing-props',
          message: 'Invalid business id or auth token',
          severity: 'error',
        }
      })
    );
  });
});
