jest.mock('../../utils/check-pkg-version', () => ({ checkPkgVersion: jest.fn() }));
jest.mock('../../ui-components/styled-host/styled-host.css', () => '');

import { h } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';
import { JustifiDisputeManagementCore } from './dispute-management-core';
import { JustifiDisputeNotification } from './justifi-dispute-notification';
import { JustifiDisputeResponse } from './dispute-response/justifi-dispute-response';
import { JustifiDisputeResponseCore } from './dispute-response/dispute-response-core';
import { JustifiProductOrService } from './dispute-response/justifi-product-or-service';
import { JustifiCustomerDetails } from './dispute-response/justifi-customer-details';
import { JustifiCancellationPolicy } from './dispute-response/justifi-cancellation-policy';
import { JustifiRefundPolicy } from './dispute-response/justifi-refund-policy';
import { JustifiDuplicateCharge } from './dispute-response/justifi-duplicate-charge';
import { JustifiElectronicEvidence } from './dispute-response/justifi-electronic-evidence';
import { JustifiShippingDetails } from './dispute-response/justifi-shipping-details';
import { JustifiAdditionalStatement } from './dispute-response/justifi-additional-statement';
import { DisputeStatus } from '../../api/Dispute';
import { DisputeManagementClickActions } from './event-types';
import JustifiAnalytics from '../../api/Analytics';

const components = [
  JustifiDisputeManagementCore,
  JustifiDisputeNotification,
  JustifiDisputeResponse,
  JustifiDisputeResponseCore,
  JustifiProductOrService,
  JustifiCustomerDetails,
  JustifiCancellationPolicy,
  JustifiRefundPolicy,
  JustifiDuplicateCharge,
  JustifiElectronicEvidence,
  JustifiShippingDetails,
  JustifiAdditionalStatement,
];

const baseDispute = {
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

beforeEach(() => {
  (JustifiAnalytics.prototype as any).trackCustomEvents = jest.fn();
});

describe('justifi-dispute-management-core', () => {
  it('calls getDispute on componentWillLoad', async () => {
    const getDispute = jest.fn(({ onSuccess }) => {
      onSuccess({ dispute: baseDispute });
    });

    await newSpecPage({
      components,
      template: () => (
        <justifi-dispute-management-core
          getDispute={getDispute}
          disputeId="dp_1"
          authToken="tok"
        />
      ),
    });

    expect(getDispute).toHaveBeenCalledTimes(1);
  });

  it('renders justifi-dispute-notification by default', async () => {
    const getDispute = jest.fn(({ onSuccess }) => {
      onSuccess({ dispute: baseDispute });
    });

    const page = await newSpecPage({
      components,
      template: () => (
        <justifi-dispute-management-core
          getDispute={getDispute}
          disputeId="dp_1"
          authToken="tok"
        />
      ),
    });

    await page.waitForChanges();
    await new Promise((r) => setTimeout(r, 0));

    const notification = page.root.querySelector('justifi-dispute-notification');
    const response = page.root.querySelector('justifi-dispute-response');
    expect(notification).toBeTruthy();
    expect(response).toBeFalsy();
  });

  it('click-event respondToDispute switches to justifi-dispute-response', async () => {
    const getDispute = jest.fn(({ onSuccess }) => {
      onSuccess({ dispute: baseDispute });
    });

    const page = await newSpecPage({
      components,
      template: () => (
        <justifi-dispute-management-core
          getDispute={getDispute}
          disputeId="dp_1"
          authToken="tok"
        />
      ),
    });

    await page.waitForChanges();
    await new Promise((r) => setTimeout(r, 0));

    const core = page.rootInstance as JustifiDisputeManagementCore;
    core.disputeResponseHandler(
      new CustomEvent('click-event', { detail: { name: DisputeManagementClickActions.respondToDispute } })
    );
    await page.waitForChanges();

    const response = page.root.querySelector('justifi-dispute-response');
    const notification = page.root.querySelector('justifi-dispute-notification');
    expect(response).toBeTruthy();
    expect(notification).toBeFalsy();
  });

  it('click-event cancelDispute switches back to notification', async () => {
    const getDispute = jest.fn(({ onSuccess }) => {
      onSuccess({ dispute: baseDispute });
    });

    const page = await newSpecPage({
      components,
      template: () => (
        <justifi-dispute-management-core
          getDispute={getDispute}
          disputeId="dp_1"
          authToken="tok"
        />
      ),
    });

    await page.waitForChanges();
    await new Promise((r) => setTimeout(r, 0));

    const core = page.rootInstance as JustifiDisputeManagementCore;
    core.disputeResponseHandler(
      new CustomEvent('click-event', { detail: { name: DisputeManagementClickActions.respondToDispute } })
    );
    await page.waitForChanges();

    core.disputeResponseHandler(
      new CustomEvent('click-event', { detail: { name: DisputeManagementClickActions.cancelDispute } })
    );
    await page.waitForChanges();

    const notification = page.root.querySelector('justifi-dispute-notification');
    const response = page.root.querySelector('justifi-dispute-response');
    expect(notification).toBeTruthy();
    expect(response).toBeFalsy();
  });

  it('submit-event re-fetches dispute via getDispute', async () => {
    const getDispute = jest.fn(({ onSuccess }) => {
      onSuccess({ dispute: baseDispute });
    });

    const page = await newSpecPage({
      components,
      template: () => (
        <justifi-dispute-management-core
          getDispute={getDispute}
          disputeId="dp_1"
          authToken="tok"
        />
      ),
    });

    await page.waitForChanges();
    await new Promise((r) => setTimeout(r, 0));
    expect(getDispute).toHaveBeenCalledTimes(1);

    const core = page.rootInstance as JustifiDisputeManagementCore;
    core.disputeSubmittedHandler();
    await page.waitForChanges();
    await new Promise((r) => setTimeout(r, 0));

    expect(getDispute).toHaveBeenCalledTimes(2);
  });

  it('after re-fetch hides form if status is no longer needs_response', async () => {
    const disputeUnderReview = { ...baseDispute, status: DisputeStatus.underReview };
    let callCount = 0;
    const getDispute = jest.fn(({ onSuccess }) => {
      callCount++;
      onSuccess({ dispute: callCount === 1 ? baseDispute : disputeUnderReview });
    });

    const page = await newSpecPage({
      components,
      template: () => (
        <justifi-dispute-management-core
          getDispute={getDispute}
          disputeId="dp_1"
          authToken="tok"
        />
      ),
    });

    await page.waitForChanges();
    await new Promise((r) => setTimeout(r, 0));

    const core = page.rootInstance as JustifiDisputeManagementCore;
    core.disputeResponseHandler(
      new CustomEvent('click-event', { detail: { name: DisputeManagementClickActions.respondToDispute } })
    );
    await page.waitForChanges();

    expect(page.root.querySelector('justifi-dispute-response')).toBeTruthy();

    core.disputeSubmittedHandler();
    await page.waitForChanges();
    await new Promise((r) => setTimeout(r, 0));

    expect(page.root.querySelector('justifi-dispute-notification')).toBeTruthy();
    expect(page.root.querySelector('justifi-dispute-response')).toBeFalsy();
  });

  it('propagates error-event from children', async () => {
    const getDispute = jest.fn(({ onSuccess }) => {
      onSuccess({ dispute: baseDispute });
    });
    const errorSpy = jest.fn();

    const page = await newSpecPage({
      components,
      template: () => (
        <justifi-dispute-management-core
          getDispute={getDispute}
          disputeId="dp_1"
          authToken="tok"
          onError-event={errorSpy}
        />
      ),
    });

    await page.waitForChanges();
    await new Promise((r) => setTimeout(r, 0));

    const notification = page.root.querySelector('justifi-dispute-notification');
    notification.dispatchEvent(
      new CustomEvent('error-event', {
        detail: { errorCode: 'test-error', message: 'Test', severity: 'error' },
        bubbles: true,
      })
    );
    await page.waitForChanges();

    expect(errorSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        detail: expect.objectContaining({
          errorCode: 'test-error',
          message: 'Test',
          severity: 'error',
        }),
      })
    );
  });
});
