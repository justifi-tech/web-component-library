import { newSpecPage } from '@stencil/core/testing';
import { BusinessDetails } from '../business-details';
import { BusinessDetailsCore } from '../business-details-core';
import { Details } from '../../details/details';

describe('justifi-business-details', () => {
  it('initializes getBusiness on load with valid props', async () => {
    const page = await newSpecPage({
      components: [BusinessDetails],
      html: `<justifi-business-details business-id="123" auth-token="token" />`,
    });

    page.waitForChanges();

    expect(page.rootInstance.getBusiness).toBeDefined();
    expect(page.rootInstance.errorMessage).toBeUndefined();
  });

  it('sets an error message with invalid props', async () => {
    const page = await newSpecPage({
      components: [BusinessDetails],
      html: `<justifi-business-details></justifi-business-details>`, // No props provided
    });

    page.waitForChanges();

    expect(page.rootInstance.errorMessage).toBe('Invalid business id or auth token');
  });

  it('renders the error state when there is an error message', async () => {
    const page = await newSpecPage({
      components: [BusinessDetails, BusinessDetailsCore],
      html: `<justifi-business-details />`,
    });

    await page.waitForChanges();

    expect(page.rootInstance.errorMessage).toBe('Invalid business id or auth token');
    expect(page.root).toMatchSnapshot();
  });

  it('renders business-details-core when there is no error message', async () => {
    const page = await newSpecPage({
      components: [BusinessDetails, BusinessDetailsCore],
      html: `<justifi-business-details business-id="123" auth-token="token" />`,
    });

    page.waitForChanges();

    const core = page.root.shadowRoot.querySelector('business-details-core');
    expect(core).not.toBeNull();
  });

  it('emits expiredToken event when the error is NOT_AUTHENTICATED', async () => {
    const eventSpy = jest.fn();

    const page = await newSpecPage({
      components: [BusinessDetails, BusinessDetailsCore, Details],
      html: `<justifi-business-details business-id="123" auth-token="token" />`,
    });

    page.root.addEventListener('tokenExpired', eventSpy);

    page.rootInstance.handleError({ detail: 'Not Authenticated' });

    expect(eventSpy).toHaveBeenCalled();
  });
});
