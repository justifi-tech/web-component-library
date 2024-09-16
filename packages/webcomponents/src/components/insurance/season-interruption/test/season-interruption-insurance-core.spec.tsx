jest.mock('../../../../ui-components/styled-host/styled-host.css', () => '');

import { h } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';
import { SeasonInterruptionInsuranceCore } from '../season-interruption-insurance-core';
import { makeGetQuote } from '../../insurance-actions';
import { API_NOT_AUTHENTICATED_ERROR } from '../../../../api/shared';
import mockSeasonInterruptionInsurance from '../../../../../../../mockData/mockSeasonInterruptionInsurance.json';
import { insuranceValuesStore, insuranceErrorsStore } from '../../insurance-state';

describe('justifi-season-interruption-insurance-core', () => {
  beforeEach(() => insuranceValuesStore.dispose());
  beforeEach(() => insuranceErrorsStore.dispose());

  it('should display loading state correctly', async () => {
    const page = await newSpecPage({
      components: [SeasonInterruptionInsuranceCore],
      template: () => <justifi-season-interruption-insurance-core auth-token="123" />,
    });

    await page.waitForChanges();

    expect(page.root).toMatchSnapshot();
  });

  it('loads and sets the quote to state correctly', async () => {
    const getQuote = makeGetQuote({
      authToken: '123',
      service: {
        fetchQuote: jest.fn().mockResolvedValue(mockSeasonInterruptionInsurance),
      },
    })

    const page = await newSpecPage({
      components: [SeasonInterruptionInsuranceCore],
      template: () => <justifi-season-interruption-insurance-core auth-token="123" getQuote={getQuote} />,
    });

    await page.waitForChanges();

    expect(page.root).toMatchSnapshot();
  });

  it('should emit error event when fetch fails', async () => {
    const getQuote = makeGetQuote({
      authToken: '',
      service: {
        fetchQuote: jest.fn().mockRejectedValue(new Error('Fetch error')),
      },
    })

    const errorSpy = jest.fn();

    const page = await newSpecPage({
      components: [SeasonInterruptionInsuranceCore],
      template: () => <justifi-season-interruption-insurance-core auth-token="123" getQuote={getQuote} onError-event={errorSpy} />,
    });

    await page.waitForChanges();

    expect(errorSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        detail: {
          errorCode: 'fetch-error',
          message: 'Fetch error',
          severity: 'error',
        }
      })
    );
  });

  it('should emit error event when API returns error', async () => {
    const getQuote = makeGetQuote({
      authToken: '',
      service: {
        fetchQuote: jest.fn().mockResolvedValue(API_NOT_AUTHENTICATED_ERROR),
      },
    })

    const errorSpy = jest.fn();

    const page = await newSpecPage({
      components: [SeasonInterruptionInsuranceCore],
      template: () => <justifi-season-interruption-insurance-core auth-token="123" getQuote={getQuote} onError-event={errorSpy} />,
    });

    await page.waitForChanges();

    expect(errorSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        detail: {
          errorCode: 'not-authenticated',
          message: 'Not Authenticated',
          severity: 'error',
        }
      })
    );
  });

  it('validates that a selection was made', async () => {
    const getQuote = makeGetQuote({
      authToken: '123',
      service: {
        fetchQuote: jest.fn().mockResolvedValue(mockSeasonInterruptionInsurance),
      },
    })

    const page = await newSpecPage({
      components: [SeasonInterruptionInsuranceCore],
      template: () => <justifi-season-interruption-insurance-core auth-token="123" getQuote={getQuote} />,
    });

    await page.waitForChanges();

    const instance: any = page.rootInstance;
    const { isValid } = await instance.validate();

    await page.waitForChanges();

    expect(isValid).toBe(false); // Assuming provided fields pass the validation
    expect(page.root).toMatchSnapshot();
  });
});
