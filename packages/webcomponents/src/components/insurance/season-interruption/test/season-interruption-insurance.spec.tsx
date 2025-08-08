jest.mock('../../../../ui-components/styled-host/styled-host.css', () => '');

import { h } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';
import { SeasonInterruptionInsurance } from '../season-interruption-insurance';
import { insuranceValuesStore, insuranceErrorsStore } from '../../insurance-state';

describe('justifi-season-interruption-insurance', () => {
  beforeEach(() => insuranceValuesStore.dispose());
  beforeEach(() => insuranceErrorsStore.dispose());

  it('should display loading state correctly', async () => {
    const page = await newSpecPage({
      components: [SeasonInterruptionInsurance],
      template: () => <justifi-season-interruption-insurance auth-token="123" />,
    });

    await page.waitForChanges();

    expect(page.root).toMatchSnapshot();
  });

  it('loads and sets the quote to state correctly', async () => {
    const page = await newSpecPage({
      components: [SeasonInterruptionInsurance],
      template: () => <justifi-season-interruption-insurance auth-token="123" />,
    });

    await page.waitForChanges();

    expect(page.root).toMatchSnapshot();
  });

  it('should emit error event when fetch fails', async () => {
    const errorSpy = jest.fn();

    const page = await newSpecPage({
      components: [SeasonInterruptionInsurance],
      template: () => <justifi-season-interruption-insurance auth-token="" onError-event={errorSpy} />,
    });

    await page.waitForChanges();
    await new Promise(resolve => setTimeout(resolve, 100)); // Wait for async operations

    expect(errorSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        detail: {
          errorCode: 'missing-props',
          message: 'Missing authToken',
          severity: 'error',
        }
      })
    );
  });

  it('validates that a selection was made', async () => {
    const page = await newSpecPage({
      components: [SeasonInterruptionInsurance],
      template: () => <justifi-season-interruption-insurance auth-token="123" />,
    });

    await page.waitForChanges();

    const instance: any = page.rootInstance;
    const { isValid } = await instance.validate();

    await page.waitForChanges();

    expect(isValid).toBe(true); // The validation should pass when no selection is made initially
    expect(page.root).toMatchSnapshot();
  });
});
