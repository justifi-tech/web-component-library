jest.mock('../../ui-components/styled-host/styled-host.css', () => '');

import { newSpecPage } from '@stencil/core/testing';
import { JustifiDisputeNotification } from './justifi-dispute-notification';
import { Dispute, DisputeStatus } from '../../api/Dispute';
import { DisputeService } from '../../api/services/dispute.service';

const baseDispute = {
  id: 'dp_1',
  amount: 1000,
  currency: 'usd',
  payment_id: 'py_1',
  reason: 'fraudulent',
  due_date: '2099-04-01',
  status: DisputeStatus.needsResponse,
  metadata: null,
  created_at: '2026-01-01T00:00:00Z',
  updated_at: '2026-01-01T00:00:00Z',
};

function makeDispute(overrides: Partial<typeof baseDispute> = {}) {
  return new Dispute({ ...baseDispute, ...overrides });
}

describe('justifi-dispute-notification', () => {
  const components = [JustifiDisputeNotification];

  it('isLoading=true renders skeleton placeholders, no dispute content', async () => {
    const page = await newSpecPage({
      components,
      html: '<justifi-dispute-notification auth-token="tok" is-loading></justifi-dispute-notification>',
    });
    (page.root as any).isLoading = true;
    await page.waitForChanges();

    const host = page.root.shadowRoot;
    expect(host.innerHTML).toContain('skeleton');
    expect(host.textContent).not.toContain('This payment is disputed');
  });

  it('needs_response + future due_date shows amount, reason, due date, both action buttons', async () => {
    const dispute = makeDispute({ status: DisputeStatus.needsResponse, due_date: '2099-04-01' });

    const page = await newSpecPage({
      components,
      html: '<justifi-dispute-notification auth-token="tok" is-loading="false"></justifi-dispute-notification>',
    });
    (page.root as any).dispute = dispute;
    await page.waitForChanges();

    const host = page.root.shadowRoot;
    expect(host.textContent).toContain('$10.00');
    expect(host.textContent).toContain('fraudulent');
    expect(host.textContent).toContain('2099-04-01');
    expect(host.textContent).toContain('Counter dispute');
    expect(host.textContent).toContain('Accept dispute');
  });

  it('needs_response + past due_date renders past-due message, no action buttons', async () => {
    const dispute = makeDispute({ status: DisputeStatus.needsResponse, due_date: '2020-01-01' });

    const page = await newSpecPage({
      components,
      html: '<justifi-dispute-notification auth-token="tok" is-loading="false"></justifi-dispute-notification>',
    });
    (page.root as any).dispute = dispute;
    await page.waitForChanges();

    const host = page.root.shadowRoot;
    expect(host.textContent).toContain('due date');
    expect(host.textContent).toContain('has passed');
    expect(host.textContent).toContain('You can no longer submit evidence');
    expect(host.textContent).not.toContain('Counter dispute');
    expect(host.textContent).not.toContain('Accept dispute');
  });

  it('under_review renders under review copy', async () => {
    const dispute = makeDispute({ status: DisputeStatus.underReview });

    const page = await newSpecPage({
      components,
      html: '<justifi-dispute-notification auth-token="tok" isLoading="false"></justifi-dispute-notification>',
    });
    (page.root as any).dispute = dispute;
    await page.waitForChanges();

    const host = page.root.shadowRoot;
    expect(host.textContent).toContain('under review');
    expect(host.textContent).toContain('counter dispute has been submitted');
  });

  it('won renders settled-in-your-favor copy', async () => {
    const dispute = makeDispute({ status: DisputeStatus.won });

    const page = await newSpecPage({
      components,
      html: '<justifi-dispute-notification auth-token="tok" isLoading="false"></justifi-dispute-notification>',
    });
    (page.root as any).dispute = dispute;
    await page.waitForChanges();

    const host = page.root.shadowRoot;
    expect(host.textContent).toContain('settled it in your favor');
  });

  it('lost renders settled-in-their-favor copy', async () => {
    const dispute = makeDispute({ status: DisputeStatus.lost });

    const page = await newSpecPage({
      components,
      html: '<justifi-dispute-notification auth-token="tok" isLoading="false"></justifi-dispute-notification>',
    });
    (page.root as any).dispute = dispute;
    await page.waitForChanges();

    const host = page.root.shadowRoot;
    expect(host.textContent).toContain('settled it in their favor');
  });

  it('click Counter dispute emits click-event with action respondToDispute', async () => {
    const dispute = makeDispute({ status: DisputeStatus.needsResponse, due_date: '2026-04-01' });
    const clickSpy = jest.fn();

    const page = await newSpecPage({
      components,
      html: '<justifi-dispute-notification auth-token="tok" isLoading="false"></justifi-dispute-notification>',
    });
    (page.root as any).dispute = dispute;
    page.root.addEventListener('click-event', clickSpy);
    await page.waitForChanges();

    const counterBtn = page.root.shadowRoot.querySelector('button[class*="primary"]') as HTMLButtonElement;
    counterBtn?.click();
    await page.waitForChanges();

    expect(clickSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        detail: { name: 'respondToDispute' },
      })
    );
  });

  it('click Accept dispute calls submitDisputeResponse with { forfeit: true }', async () => {
    const dispute = makeDispute({ status: DisputeStatus.needsResponse, due_date: '2026-04-01' });
    const submitSpy = jest.spyOn(DisputeService.prototype, 'submitDisputeResponse').mockResolvedValue({ data: { id: 'dp_1' } } as any);

    const page = await newSpecPage({
      components,
      html: '<justifi-dispute-notification auth-token="tok" isLoading="false"></justifi-dispute-notification>',
    });
    (page.root as any).dispute = dispute;
    await page.waitForChanges();

    const acceptBtn = page.root.shadowRoot.querySelector('button[class*="secondary"]') as HTMLButtonElement;
    acceptBtn?.click();
    await page.waitForChanges();
    await new Promise((r) => setTimeout(r, 0));

    expect(submitSpy).toHaveBeenCalledWith(
      'dp_1',
      'tok',
      expect.objectContaining({ forfeit: true })
    );

    submitSpy.mockRestore();
  });
});
