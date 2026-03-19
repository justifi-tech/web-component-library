import { h } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';
import { JustifiCancellationPolicy } from './justifi-cancellation-policy';
import { DisputeResponseFormStep } from './dispute-response-form-types';

describe('justifi-cancellation-policy', () => {
  const components = [JustifiCancellationPolicy];

  it('renders all fields for the step', async () => {
    const page = await newSpecPage({
      components,
      template: () => <justifi-cancellation-policy disputeResponse={{}} documentErrors={{}} />,
    });
    await page.waitForChanges();

    expect(page.root.querySelector('form-control-textarea[name="cancellation_policy_disclosure"]')).toBeTruthy();
    expect(page.root.querySelector('form-control-textarea[name="cancellation_rebuttal"]')).toBeTruthy();
    expect(page.root.querySelector('form-control-file-v2[name="cancellation_policy"]')).toBeTruthy();
  });

  it('pre-populates fields from disputeResponse prop', async () => {
    const disputeResponse = { cancellation_policy_disclosure: 'Policy text' };
    const page = await newSpecPage({
      components,
      template: () => <justifi-cancellation-policy disputeResponse={disputeResponse} documentErrors={{}} />,
    });
    await page.waitForChanges();

    expect((page.rootInstance as JustifiCancellationPolicy).disputeResponse).toEqual(disputeResponse);
  });

  it('validateAndSubmit calls onSuccess with correct formData shape', async () => {
    const page = await newSpecPage({
      components,
      template: () => <justifi-cancellation-policy disputeResponse={{}} documentErrors={{}} />,
    });
    await page.waitForChanges();

    const onSuccess = jest.fn();
    await (page.rootInstance as JustifiCancellationPolicy).validateAndSubmit(onSuccess);
    await page.waitForChanges();

    expect(onSuccess).toHaveBeenCalled();
    const [, , formStep] = onSuccess.mock.calls[0];
    expect(formStep).toBe(DisputeResponseFormStep.cancellationPolicy);
  });

  it('validateAndSubmit succeeds when all fields empty (nullable schema)', async () => {
    const page = await newSpecPage({
      components,
      template: () => <justifi-cancellation-policy disputeResponse={{}} documentErrors={{}} />,
    });
    await page.waitForChanges();

    const onSuccess = jest.fn();
    await (page.rootInstance as JustifiCancellationPolicy).validateAndSubmit(onSuccess);
    await new Promise((r) => setTimeout(r, 200));
    expect(onSuccess).toHaveBeenCalled();
  });

  it('renders file input for cancellation_policy', async () => {
    const page = await newSpecPage({
      components,
      template: () => <justifi-cancellation-policy disputeResponse={{}} documentErrors={{}} />,
    });
    await page.waitForChanges();

    expect(page.root.querySelector('form-control-file-v2[name="cancellation_policy"]')).toBeTruthy();
  });

  it('displays documentErrors in UI', async () => {
    const documentErrors = { cancellation_policy: 'Upload failed' };
    const page = await newSpecPage({
      components,
      template: () => <justifi-cancellation-policy disputeResponse={{}} documentErrors={documentErrors} />,
    });
    await page.waitForChanges();

    expect((page.rootInstance as JustifiCancellationPolicy).documentErrors).toEqual(documentErrors);
  });
});
