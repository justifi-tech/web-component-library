jest.mock('../../../ui-components/styled-host/styled-host.css', () => '');
jest.mock('../../../utils/check-pkg-version', () => ({ checkPkgVersion: jest.fn() }));

import { h } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';
import { JustifiDisputeResponse } from './justifi-dispute-response';
import { JustifiDisputeResponseCore } from './dispute-response-core';
import JustifiAnalytics from '../../../api/Analytics';

beforeEach(() => {
  (JustifiAnalytics.prototype as any).trackCustomEvents = jest.fn();
});

describe('justifi-dispute-response', () => {
  const components = [JustifiDisputeResponse, JustifiDisputeResponseCore];

  it('emits error-event with MISSING_PROPS when authToken absent', async () => {
    const errorSpy = jest.fn();

    await newSpecPage({
      components,
      template: () => (
        <justifi-dispute-response disputeId="dp_1" authToken="" disputeResponse={{} as any} onError-event={errorSpy} />
      ),
    });

    expect(errorSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        detail: expect.objectContaining({
          errorCode: 'missing-props',
          severity: 'error',
        }),
      })
    );
  });

  it('emits error-event with MISSING_PROPS when disputeId absent', async () => {
    const errorSpy = jest.fn();

    await newSpecPage({
      components,
      template: () => (
        <justifi-dispute-response disputeId="" authToken="tok" disputeResponse={{} as any} onError-event={errorSpy} />
      ),
    });

    expect(errorSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        detail: expect.objectContaining({
          errorCode: 'missing-props',
          severity: 'error',
        }),
      })
    );
  });

  it('passes updateDisputeResponse, submitDisputeResponse, createDisputeEvidence to core when both props present', async () => {
    const page = await newSpecPage({
      components,
      template: () => (
        <justifi-dispute-response disputeId="dp_1" authToken="tok" disputeResponse={{} as any} />
      ),
    });

    await page.waitForChanges();

    const core = page.root.shadowRoot.querySelector('justifi-dispute-response-core');
    expect(core).toBeTruthy();
    expect((core as any).updateDisputeResponse).toBeDefined();
    expect((core as any).submitDisputeResponse).toBeDefined();
    expect((core as any).createDisputeEvidence).toBeDefined();
  });

  it('pre-populates core disputeResponse prop from its own prop', async () => {
    const disputeResponse = { product_description: 'Test product' } as any;

    const page = await newSpecPage({
      components,
      template: () => (
        <justifi-dispute-response
          disputeId="dp_1"
          authToken="tok"
          disputeResponse={disputeResponse}
        />
      ),
    });

    await page.waitForChanges();

    const core = page.root.shadowRoot.querySelector('justifi-dispute-response-core');
    expect((core as any).disputeResponse).toEqual(disputeResponse);
  });
});
