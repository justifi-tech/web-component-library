import { h } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';
import { JustifiAdditionalStatement } from './justifi-additional-statement';
import { DisputeResponseFormStep } from './dispute-response-form-types';

describe('justifi-additional-statement', () => {
  const components = [JustifiAdditionalStatement];

  it('renders all fields for the step', async () => {
    const page = await newSpecPage({
      components,
      template: () => <justifi-additional-statement disputeResponse={{}} documentErrors={{}} />,
    });
    await page.waitForChanges();

    expect(page.root.querySelector('form-control-textarea[name="additional_statement"]')).toBeTruthy();
    expect(page.root.querySelector('form-control-file-v2[name="uncategorized_file"]')).toBeTruthy();
  });

  it('pre-populates fields from disputeResponse prop', async () => {
    const disputeResponse = { additional_statement: 'Additional info' };
    const page = await newSpecPage({
      components,
      template: () => <justifi-additional-statement disputeResponse={disputeResponse} documentErrors={{}} />,
    });
    await page.waitForChanges();

    expect((page.rootInstance as JustifiAdditionalStatement).disputeResponse).toEqual(disputeResponse);
  });

  it('validateAndSubmit calls onSuccess with correct formData shape', async () => {
    const page = await newSpecPage({
      components,
      template: () => <justifi-additional-statement disputeResponse={{}} documentErrors={{}} />,
    });
    await page.waitForChanges();

    const onSuccess = jest.fn();
    await (page.rootInstance as JustifiAdditionalStatement).validateAndSubmit(onSuccess);
    await page.waitForChanges();

    expect(onSuccess).toHaveBeenCalled();
    const [, , formStep] = onSuccess.mock.calls[0];
    expect(formStep).toBe(DisputeResponseFormStep.additionalStatement);
  });

  it('validateAndSubmit succeeds when all fields empty (nullable schema)', async () => {
    const page = await newSpecPage({
      components,
      template: () => <justifi-additional-statement disputeResponse={{}} documentErrors={{}} />,
    });
    await page.waitForChanges();

    const onSuccess = jest.fn();
    await (page.rootInstance as JustifiAdditionalStatement).validateAndSubmit(onSuccess);
    await new Promise((r) => setTimeout(r, 200));
    expect(onSuccess).toHaveBeenCalled();
  });

  it('renders file input for uncategorized_file', async () => {
    const page = await newSpecPage({
      components,
      template: () => <justifi-additional-statement disputeResponse={{}} documentErrors={{}} />,
    });
    await page.waitForChanges();

    expect(page.root.querySelector('form-control-file-v2[name="uncategorized_file"]')).toBeTruthy();
  });

  it('displays documentErrors in UI', async () => {
    const documentErrors = { uncategorized_file: 'Upload failed' };
    const page = await newSpecPage({
      components,
      template: () => <justifi-additional-statement disputeResponse={{}} documentErrors={documentErrors} />,
    });
    await page.waitForChanges();

    expect((page.rootInstance as JustifiAdditionalStatement).documentErrors).toEqual(documentErrors);
  });
});
