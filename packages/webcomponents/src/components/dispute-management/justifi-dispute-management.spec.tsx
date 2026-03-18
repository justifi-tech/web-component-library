jest.mock('../../utils/check-pkg-version', () => ({ checkPkgVersion: jest.fn() }));

import { h } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';
import { JustifiDisputeManagement } from './justifi-dispute-management';
import { JustifiDisputeManagementCore } from './dispute-management-core';
import { JustifiDisputeNotification } from './justifi-dispute-notification';
import { JustifiDisputeResponse } from './dispute-response/justifi-dispute-response';
import JustifiAnalytics from '../../api/Analytics';
import { DisputeStatus } from '../../api/Dispute';

import { DisputeService } from '../../api/services/dispute.service';

beforeEach(() => {
  (JustifiAnalytics.prototype as any).trackCustomEvents = jest.fn();
});

describe('justifi-dispute-management', () => {
  const components = [
    JustifiDisputeManagement,
    JustifiDisputeManagementCore,
    JustifiDisputeNotification,
    JustifiDisputeResponse,
  ];

  it('emits error-event with MISSING_PROPS when authToken is absent', async () => {
    const errorSpy = jest.fn();

    await newSpecPage({
      components,
      template: () => (
        <justifi-dispute-management disputeId="dp_1" authToken="" onError-event={errorSpy} />
      ),
    });

    expect(errorSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        detail: {
          errorCode: 'missing-props',
          message: 'Dispute ID and Auth Token are required',
          severity: 'error',
        },
      })
    );
  });

  it('emits error-event with MISSING_PROPS when disputeId is absent', async () => {
    const errorSpy = jest.fn();

    await newSpecPage({
      components,
      template: () => (
        <justifi-dispute-management disputeId="" authToken="tok" onError-event={errorSpy} />
      ),
    });

    expect(errorSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        detail: {
          errorCode: 'missing-props',
          message: 'Dispute ID and Auth Token are required',
          severity: 'error',
        },
      })
    );
  });

  it('calls makeGetDispute with correct { id, authToken } when both props present', async () => {
    const fetchSpy = jest.spyOn(DisputeService.prototype, 'fetchDispute').mockResolvedValue({
      data: { id: 'dp_1', amount: 1000, currency: 'usd', payment_id: 'py_1', reason: 'fraudulent', due_date: '2026-04-01', status: DisputeStatus.needsResponse, metadata: null, created_at: '2026-01-01', updated_at: '2026-01-01' },
      error: null,
      page_info: null,
    } as any);

    await newSpecPage({
      components,
      template: () => (
        <justifi-dispute-management disputeId="dp_1" authToken="tok" />
      ),
    });

    await new Promise((r) => setTimeout(r, 0));

    expect(fetchSpy).toHaveBeenCalledWith('dp_1', 'tok');
    fetchSpy.mockRestore();
  });

  it('re-invokes makeGetDispute on authToken or disputeId @Watch change', async () => {
    const fetchSpy = jest.spyOn(DisputeService.prototype, 'fetchDispute').mockResolvedValue({
      data: { id: 'dp_1', amount: 1000, currency: 'usd', payment_id: 'py_1', reason: 'fraudulent', due_date: '2026-04-01', status: DisputeStatus.needsResponse, metadata: null, created_at: '2026-01-01', updated_at: '2026-01-01' },
      error: null,
      page_info: null,
    } as any);

    const page = await newSpecPage({
      components,
      template: () => (
        <justifi-dispute-management disputeId="dp_1" authToken="tok" />
      ),
    });

    await new Promise((r) => setTimeout(r, 0));
    expect(fetchSpy).toHaveBeenCalledTimes(1);

    page.root.setAttribute('dispute-id', 'dp_2');
    page.root.setAttribute('auth-token', 'new_tok');
    await page.waitForChanges();
    await new Promise((r) => setTimeout(r, 0));

    expect(fetchSpy).toHaveBeenCalledTimes(2);
    expect(fetchSpy).toHaveBeenLastCalledWith('dp_2', 'new_tok');
    fetchSpy.mockRestore();
  });
});
