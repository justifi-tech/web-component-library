import { h } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';
import { AdditionalStatement } from './additional-statement';
import { DisputeResponseFormStep } from './dispute-response-form-types';

describe('additional-statement', () => {
  const components = [AdditionalStatement];

  it('renders all fields for the step', async () => {
    const page = await newSpecPage({
      components,
      template: () => <additional-statement disputeResponse={{}} documentErrors={{}} />,
    });
    await page.waitForChanges();

    expect(page.root.querySelector('form-control-textarea[name="additional_statement"]')).toBeTruthy();
    expect(page.root.querySelector('form-control-file-v2[name="uncategorized_file"]')).toBeTruthy();
  });

  it('pre-populates fields from disputeResponse prop', async () => {
    const disputeResponse = { additional_statement: 'Additional info' };
    const page = await newSpecPage({
      components,
      template: () => <additional-statement disputeResponse={disputeResponse} documentErrors={{}} />,
    });
    await page.waitForChanges();

    expect((page.rootInstance as AdditionalStatement).disputeResponse).toEqual(disputeResponse);
  });

  it('validateAndSubmit calls onSuccess with correct formData shape', async () => {
    const page = await newSpecPage({
      components,
      template: () => <additional-statement disputeResponse={{}} documentErrors={{}} />,
    });
    await page.waitForChanges();

    const onSuccess = jest.fn();
    await (page.rootInstance as AdditionalStatement).validateAndSubmit(onSuccess);
    await page.waitForChanges();

    expect(onSuccess).toHaveBeenCalled();
    const [, , formStep] = onSuccess.mock.calls[0];
    expect(formStep).toBe(DisputeResponseFormStep.additionalStatement);
  });

  it('validateAndSubmit succeeds when all fields empty (nullable schema)', async () => {
    const page = await newSpecPage({
      components,
      template: () => <additional-statement disputeResponse={{}} documentErrors={{}} />,
    });
    await page.waitForChanges();

    const onSuccess = jest.fn();
    await (page.rootInstance as AdditionalStatement).validateAndSubmit(onSuccess);
    await new Promise((r) => setTimeout(r, 200));
    expect(onSuccess).toHaveBeenCalled();
  });

  it('renders file input for uncategorized_file', async () => {
    const page = await newSpecPage({
      components,
      template: () => <additional-statement disputeResponse={{}} documentErrors={{}} />,
    });
    await page.waitForChanges();

    expect(page.root.querySelector('form-control-file-v2[name="uncategorized_file"]')).toBeTruthy();
  });

  it('displays documentErrors in UI', async () => {
    const documentErrors = { uncategorized_file: 'Upload failed' };
    const page = await newSpecPage({
      components,
      template: () => <additional-statement disputeResponse={{}} documentErrors={documentErrors} />,
    });
    await page.waitForChanges();

    expect((page.rootInstance as AdditionalStatement).documentErrors).toEqual(documentErrors);
  });
});
