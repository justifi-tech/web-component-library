jest.mock('../../utils/check-pkg-version', () => ({ checkPkgVersion: jest.fn() }));
jest.mock('../../ui-components/styled-host/styled-host.css', () => '');

import { h } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';
import { JustifiDisputeManagement } from './justifi-dispute-management';
import { DisputeNotification } from './dispute-notification';
import { DisputeResponse } from './dispute-response/dispute-response';
import { ProductOrService } from './dispute-response/product-or-service';
import { CustomerDetails } from './dispute-response/customer-details';
import { CancellationPolicy } from './dispute-response/cancellation-policy';
import { RefundPolicy } from './dispute-response/refund-policy';
import { DuplicateCharge } from './dispute-response/duplicate-charge';
import { ElectronicEvidence } from './dispute-response/electronic-evidence';
import { ShippingDetails } from './dispute-response/shipping-details';
import { AdditionalStatement } from './dispute-response/additional-statement';
import JustifiAnalytics from '../../api/Analytics';
import { DisputeStatus } from '../../api/Dispute';
import { DisputeService } from '../../api/services/dispute.service';
import { DisputeManagementClickActions } from './event-types';

const disputeNeedsResponse = {
  id: 'dp_1',
  amount: 1000,
  currency: 'usd',
  payment_id: 'py_1',
  reason: 'fraudulent',
  due_date: '2026-04-01',
  status: DisputeStatus.needsResponse,
  metadata: null,
  created_at: '2026-01-01T00:00:00Z',
  updated_at: '2026-01-01T00:00:00Z',
};

const disputeUnderReview = { ...disputeNeedsResponse, status: DisputeStatus.underReview };

function apiOk(data: object) {
  return {
    data,
    error: null,
    page_info: null,
  } as any;
}

const responseComponents = [
  ProductOrService,
  CustomerDetails,
  CancellationPolicy,
  RefundPolicy,
  DuplicateCharge,
  ElectronicEvidence,
  ShippingDetails,
  AdditionalStatement,
];

const components = [
  JustifiDisputeManagement,
  DisputeNotification,
  DisputeResponse,
  ...responseComponents,
];

beforeEach(() => {
  (JustifiAnalytics.prototype as any).trackCustomEvents = jest.fn();
});

describe('justifi-dispute-management', () => {
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
      }),
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
      }),
    );
  });

  it('calls makeGetDispute with correct { id, authToken } when both props present', async () => {
    const fetchSpy = jest.spyOn(DisputeService.prototype, 'fetchDispute').mockResolvedValue(
      apiOk({
        id: 'dp_1',
        amount: 1000,
        currency: 'usd',
        payment_id: 'py_1',
        reason: 'fraudulent',
        due_date: '2026-04-01',
        status: DisputeStatus.needsResponse,
        metadata: null,
        created_at: '2026-01-01',
        updated_at: '2026-01-01',
      }),
    );

    await newSpecPage({
      components,
      template: () => <justifi-dispute-management disputeId="dp_1" authToken="tok" />,
    });

    await new Promise((r) => setTimeout(r, 0));

    expect(fetchSpy).toHaveBeenCalledWith('dp_1', 'tok');
    fetchSpy.mockRestore();
  });

  it('re-invokes makeGetDispute on authToken or disputeId @Watch change', async () => {
    const fetchSpy = jest.spyOn(DisputeService.prototype, 'fetchDispute').mockResolvedValue(
      apiOk({
        id: 'dp_1',
        amount: 1000,
        currency: 'usd',
        payment_id: 'py_1',
        reason: 'fraudulent',
        due_date: '2026-04-01',
        status: DisputeStatus.needsResponse,
        metadata: null,
        created_at: '2026-01-01',
        updated_at: '2026-01-01',
      }),
    );

    const page = await newSpecPage({
      components,
      template: () => <justifi-dispute-management disputeId="dp_1" authToken="tok" />,
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

describe('justifi-dispute-management flow', () => {
  it('fetches dispute on componentWillLoad', async () => {
    const fetchSpy = jest.spyOn(DisputeService.prototype, 'fetchDispute').mockResolvedValue(apiOk(disputeNeedsResponse));

    await newSpecPage({
      components,
      template: () => <justifi-dispute-management disputeId="dp_1" authToken="tok" />,
    });

    await new Promise((r) => setTimeout(r, 0));
    expect(fetchSpy).toHaveBeenCalledTimes(1);
    fetchSpy.mockRestore();
  });

  it('renders dispute-notification by default', async () => {
    jest.spyOn(DisputeService.prototype, 'fetchDispute').mockResolvedValue(apiOk(disputeNeedsResponse));

    const page = await newSpecPage({
      components,
      template: () => <justifi-dispute-management disputeId="dp_1" authToken="tok" />,
    });

    await page.waitForChanges();
    await new Promise((r) => setTimeout(r, 0));

    const root = page.root.shadowRoot;
    const notification = root.querySelector('dispute-notification');
    const response = root.querySelector('dispute-response');
    expect(notification).toBeTruthy();
    expect(response).toBeFalsy();
    jest.restoreAllMocks();
  });

  it('click-event respondToDispute switches to dispute-response', async () => {
    jest.spyOn(DisputeService.prototype, 'fetchDispute').mockResolvedValue(apiOk(disputeNeedsResponse));

    const page = await newSpecPage({
      components,
      template: () => <justifi-dispute-management disputeId="dp_1" authToken="tok" />,
    });

    await page.waitForChanges();
    await new Promise((r) => setTimeout(r, 0));

    const inst = page.rootInstance as JustifiDisputeManagement;
    inst.disputeResponseHandler(
      new CustomEvent('click-event', { detail: { name: DisputeManagementClickActions.respondToDispute } }),
    );
    await page.waitForChanges();

    const root = page.root.shadowRoot;
    const response = root.querySelector('dispute-response');
    const notification = root.querySelector('dispute-notification');
    expect(response).toBeTruthy();
    expect(notification).toBeFalsy();
    jest.restoreAllMocks();
  });

  it('click-event cancelDispute switches back to notification', async () => {
    jest.spyOn(DisputeService.prototype, 'fetchDispute').mockResolvedValue(apiOk(disputeNeedsResponse));

    const page = await newSpecPage({
      components,
      template: () => <justifi-dispute-management disputeId="dp_1" authToken="tok" />,
    });

    await page.waitForChanges();
    await new Promise((r) => setTimeout(r, 0));

    const inst = page.rootInstance as JustifiDisputeManagement;
    inst.disputeResponseHandler(
      new CustomEvent('click-event', { detail: { name: DisputeManagementClickActions.respondToDispute } }),
    );
    await page.waitForChanges();

    inst.disputeResponseHandler(
      new CustomEvent('click-event', { detail: { name: DisputeManagementClickActions.cancelDispute } }),
    );
    await page.waitForChanges();

    const root = page.root.shadowRoot;
    const notification = root.querySelector('dispute-notification');
    const response = root.querySelector('dispute-response');
    expect(notification).toBeTruthy();
    expect(response).toBeFalsy();
    jest.restoreAllMocks();
  });

  it('submit-event re-fetches dispute via getDispute', async () => {
    const fetchSpy = jest.spyOn(DisputeService.prototype, 'fetchDispute').mockResolvedValue(apiOk(disputeNeedsResponse));

    const page = await newSpecPage({
      components,
      template: () => <justifi-dispute-management disputeId="dp_1" authToken="tok" />,
    });

    await page.waitForChanges();
    await new Promise((r) => setTimeout(r, 0));
    expect(fetchSpy).toHaveBeenCalledTimes(1);

    const inst = page.rootInstance as JustifiDisputeManagement;
    inst.disputeSubmittedHandler();
    await page.waitForChanges();
    await new Promise((r) => setTimeout(r, 0));

    expect(fetchSpy).toHaveBeenCalledTimes(2);
    fetchSpy.mockRestore();
  });

  it('after re-fetch hides form if status is no longer needs_response', async () => {
    const fetchSpy = jest
      .spyOn(DisputeService.prototype, 'fetchDispute')
      .mockResolvedValueOnce(apiOk(disputeNeedsResponse))
      .mockResolvedValueOnce(apiOk(disputeUnderReview));

    const page = await newSpecPage({
      components,
      template: () => <justifi-dispute-management disputeId="dp_1" authToken="tok" />,
    });

    await page.waitForChanges();
    await new Promise((r) => setTimeout(r, 0));

    const inst = page.rootInstance as JustifiDisputeManagement;
    inst.disputeResponseHandler(
      new CustomEvent('click-event', { detail: { name: DisputeManagementClickActions.respondToDispute } }),
    );
    await page.waitForChanges();

    expect(page.root.shadowRoot.querySelector('dispute-response')).toBeTruthy();

    inst.disputeSubmittedHandler();
    await page.waitForChanges();
    await new Promise((r) => setTimeout(r, 0));

    expect(page.root.shadowRoot.querySelector('dispute-notification')).toBeTruthy();
    expect(page.root.shadowRoot.querySelector('dispute-response')).toBeFalsy();
    fetchSpy.mockRestore();
  });

  it('propagates error-event from children', async () => {
    jest.spyOn(DisputeService.prototype, 'fetchDispute').mockResolvedValue(apiOk(disputeNeedsResponse));
    const errorSpy = jest.fn();

    const page = await newSpecPage({
      components,
      template: () => (
        <justifi-dispute-management disputeId="dp_1" authToken="tok" onError-event={errorSpy} />
      ),
    });

    await page.waitForChanges();
    await new Promise((r) => setTimeout(r, 0));

    const notification = page.root.shadowRoot.querySelector('dispute-notification');
    notification.dispatchEvent(
      new CustomEvent('error-event', {
        detail: { errorCode: 'test-error', message: 'Test', severity: 'error' },
        bubbles: true,
        composed: true,
      }),
    );
    await page.waitForChanges();

    expect(errorSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        detail: expect.objectContaining({
          errorCode: 'test-error',
          message: 'Test',
          severity: 'error',
        }),
      }),
    );
    jest.restoreAllMocks();
  });
});
