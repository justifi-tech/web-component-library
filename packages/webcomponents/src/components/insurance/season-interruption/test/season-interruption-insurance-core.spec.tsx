import { h } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';
import { SeasonInterruptionInsuranceCore } from '../season-interruption-insurance-core';
import { makeGetQuote } from '../../insurance-actions';
import { API_NOT_AUTHENTICATED_ERROR } from '../../../../api/shared';

describe('justifi-season-interruption-insurance-core', () => {
  it('should display loading state correctly', async () => {
    const page = await newSpecPage({
      components: [SeasonInterruptionInsuranceCore],
      template: () => <justifi-season-interruption-insurance-core auth-token="123" />,
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
});
