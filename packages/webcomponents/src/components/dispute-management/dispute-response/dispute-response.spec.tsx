jest.mock('../../../ui-components/styled-host/styled-host.css', () => '');
jest.mock('../../../utils/check-pkg-version', () => ({ checkPkgVersion: jest.fn() }));

import { h } from '@stencil/core';
import { newSpecPage, type SpecPage } from '@stencil/core/testing';
import { DisputeResponse } from './dispute-response';
import { ProductOrService } from './product-or-service';
import { CustomerDetails } from './customer-details';
import { CancellationPolicy } from './cancellation-policy';
import { RefundPolicy } from './refund-policy';
import { DuplicateCharge } from './duplicate-charge';
import { ElectronicEvidence } from './electronic-evidence';
import { ShippingDetails } from './shipping-details';
import { AdditionalStatement } from './additional-statement';
import { DisputeManagementClickActions } from '../event-types';
import { DisputeResponseFormStep } from './dispute-response-form-types';
import JustifiAnalytics from '../../../api/Analytics';

const stepComponents = [
  ProductOrService,
  CustomerDetails,
  CancellationPolicy,
  RefundPolicy,
  DuplicateCharge,
  ElectronicEvidence,
  ShippingDetails,
  AdditionalStatement,
];

const components = [DisputeResponse, ...stepComponents];

const mockUpdate = jest.fn(({ payload, onSuccess }) => {
  onSuccess({ data: payload });
  return Promise.resolve({ data: payload } as any);
});

const mockSubmit = jest.fn(({ payload, onSuccess }) => {
  onSuccess({ data: payload });
  return Promise.resolve({ data: payload } as any);
});

const mockCreateEvidence = jest.fn(({ onSuccess }) => {
  onSuccess({ data: { presigned_url: 'https://presigned.example/upload' } });
  return Promise.resolve({ data: { presigned_url: 'https://presigned.example/upload' } } as any);
});

function responseRoot(page: SpecPage) {
  return page.root!;
}

async function setupWizardPage(disputeResponse = {}) {
  const page = await newSpecPage({
    components,
    template: () => (
      <dispute-response disputeId="dp_1" authToken="tok" disputeResponse={disputeResponse as any} />
    ),
  });
  await page.waitForChanges();
  const inst = page.rootInstance as DisputeResponse;
  inst.updateDisputeResponse = mockUpdate as any;
  inst.submitDisputeResponse = mockSubmit as any;
  inst.createDisputeEvidence = mockCreateEvidence as any;
  await page.waitForChanges();
  await new Promise((r) => setTimeout(r, 0));
  return page;
}

beforeEach(() => {
  (JustifiAnalytics.prototype as any).trackCustomEvents = jest.fn();
});

describe('dispute-response', () => {
  it('emits error-event with MISSING_PROPS when authToken absent', async () => {
    const errorSpy = jest.fn();

    await newSpecPage({
      components,
      template: () => (
        <dispute-response disputeId="dp_1" authToken="" disputeResponse={{} as any} onError-event={errorSpy} />
      ),
    });

    expect(errorSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        detail: expect.objectContaining({
          errorCode: 'missing-props',
          severity: 'error',
        }),
      }),
    );
  });

  it('emits error-event with MISSING_PROPS when disputeId absent', async () => {
    const errorSpy = jest.fn();

    await newSpecPage({
      components,
      template: () => (
        <dispute-response disputeId="" authToken="tok" disputeResponse={{} as any} onError-event={errorSpy} />
      ),
    });

    expect(errorSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        detail: expect.objectContaining({
          errorCode: 'missing-props',
          severity: 'error',
        }),
      }),
    );
  });

  it('initializes updateDisputeResponse, submitDisputeResponse, createDisputeEvidence when both props present', async () => {
    const page = await newSpecPage({
      components,
      template: () => <dispute-response disputeId="dp_1" authToken="tok" disputeResponse={{} as any} />,
    });

    await page.waitForChanges();

    const inst = page.rootInstance as DisputeResponse;
    expect(inst.updateDisputeResponse).toBeDefined();
    expect(inst.submitDisputeResponse).toBeDefined();
    expect(inst.createDisputeEvidence).toBeDefined();
  });

  it('pre-populates disputeResponse prop for steps', async () => {
    const disputeResponse = { product_description: 'Test product' } as any;

    const page = await newSpecPage({
      components,
      template: () => (
        <dispute-response disputeId="dp_1" authToken="tok" disputeResponse={disputeResponse} />
      ),
    });

    await page.waitForChanges();

    expect((page.rootInstance as DisputeResponse).disputeResponse).toEqual(disputeResponse);
  });
});

describe('dispute-response wizard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn().mockResolvedValue(
      new Response(JSON.stringify({}), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    );
  });

  it('renders step 0 (product-or-service) on mount', async () => {
    const page = await setupWizardPage();

    const root = responseRoot(page);
    const step0 = root.querySelector('product-or-service');
    expect(step0).toBeTruthy();
    expect(root.querySelector('customer-details')).toBeFalsy();
  });

  it('complete-form-step-event on step N advances to step N+1', async () => {
    const page = await setupWizardPage();
    const inst = page.rootInstance as DisputeResponse;

    inst.currentStepComponentRef = {
      validateAndSubmit: jest.fn((cb) =>
        Promise.resolve(cb({ product_description: 'test' }, [], DisputeResponseFormStep.productOrService)),
      ),
    };
    await (inst as any).onNext();
    await page.waitForChanges();

    expect(inst.currentStep).toBe(1);
    expect(responseRoot(page).querySelector('customer-details')).toBeTruthy();
  });

  it('Back click on step N regresses to step N-1', async () => {
    const page = await setupWizardPage();
    const inst = page.rootInstance as DisputeResponse;

    inst.currentStep = 1;
    inst.currentStepComponentRef = {
      validateAndSubmit: jest.fn((cb) => Promise.resolve(cb({}, [], DisputeResponseFormStep.customerDetails))),
    };
    await (inst as any).onBack();
    await page.waitForChanges();

    expect(inst.currentStep).toBe(0);
    expect(mockUpdate).not.toHaveBeenCalled();
  });

  it('cancelDispute click emits click-event with cancelDispute', async () => {
    const page = await setupWizardPage();
    const clickSpy = jest.fn();
    page.root.addEventListener('click-event', clickSpy);

    const cancelBtn = responseRoot(page).querySelector('button[class*="secondary"]') as HTMLButtonElement;
    cancelBtn?.click();
    await page.waitForChanges();

    expect(clickSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        detail: { name: DisputeManagementClickActions.cancelDispute },
      }),
    );
  });

  it('steps 0-6 call updateDisputeResponse (PATCH) on advance', async () => {
    const page = await setupWizardPage();
    const inst = page.rootInstance as DisputeResponse;

    inst.currentStepComponentRef = {
      validateAndSubmit: jest.fn((cb) =>
        Promise.resolve(cb({ product_description: 'test' }, [], DisputeResponseFormStep.productOrService)),
      ),
    };
    await (inst as any).onNext();
    await page.waitForChanges();

    expect(mockUpdate).toHaveBeenCalled();
    expect(mockSubmit).not.toHaveBeenCalled();
  });

  it('step 7 calls submitDisputeResponse (POST) and emits submit-event', async () => {
    const page = await setupWizardPage();
    const inst = page.rootInstance as DisputeResponse;
    const submitSpy = jest.fn();
    page.root.addEventListener('submit-event', submitSpy);

    inst.currentStep = 7;
    inst.currentStepComponentRef = {
      validateAndSubmit: jest.fn((cb) =>
        Promise.resolve(cb({ additional_statement: 'final' }, [], DisputeResponseFormStep.additionalStatement)),
      ),
    };
    await (inst as any).onSubmit();
    await page.waitForChanges();

    expect(mockSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        payload: expect.objectContaining({ additional_statement: 'final', forfeit: false }),
      }),
    );
    expect(submitSpy).toHaveBeenCalled();
  });

  it('non-empty documentList calls createDisputeEvidence (PUT) before advancing', async () => {
    const page = await setupWizardPage();
    const inst = page.rootInstance as DisputeResponse;

    const doc: any = {
      file_name: 'doc.pdf',
      file_type: 'application/pdf',
      dispute_evidence_type: 'service_documentation',
      getFileString: () => Promise.resolve(new ArrayBuffer(8)),
    };
    inst.currentStepComponentRef = {
      validateAndSubmit: jest.fn((cb) => {
        doc.presignedUrl = 'https://presigned.example/upload';
        return Promise.resolve(cb({ product_description: 'test' }, [doc], DisputeResponseFormStep.productOrService));
      }),
    };
    await (inst as any).onNext();
    await page.waitForChanges();

    expect(mockCreateEvidence).toHaveBeenCalledWith(
      expect.objectContaining({
        payload: expect.objectContaining({
          file_name: 'doc.pdf',
          file_type: 'application/pdf',
          dispute_evidence_type: 'service_documentation',
        }),
      }),
    );
  });

  it('upload failure passes documentErrors to current step component', async () => {
    const createEvidenceWithError = jest.fn(({ onError }) => {
      onError({ error: 'Presign failed', code: 'err', severity: 'error' });
      return Promise.resolve({} as any);
    });

    const page = await newSpecPage({
      components,
      template: () => <dispute-response disputeId="dp_1" authToken="tok" disputeResponse={{} as any} />,
    });
    await page.waitForChanges();

    const inst = page.rootInstance as DisputeResponse;
    inst.updateDisputeResponse = mockUpdate as any;
    inst.submitDisputeResponse = mockSubmit as any;
    inst.createDisputeEvidence = createEvidenceWithError as any;
    await page.waitForChanges();

    const doc: any = {
      file_name: 'doc.pdf',
      file_type: 'application/pdf',
      dispute_evidence_type: 'service_documentation',
      getFileString: () => Promise.resolve(new ArrayBuffer(8)),
    };
    inst.currentStepComponentRef = {
      validateAndSubmit: jest.fn((cb) =>
        Promise.resolve(cb({ product_description: 'test' }, [doc], DisputeResponseFormStep.productOrService)),
      ),
    };
    try {
      await (inst as any).onNext();
    } catch {
      // handleSubmit throws when presigning fails
    }
    await page.waitForChanges();

    expect(inst.documentErrors).toEqual(expect.objectContaining({ service_documentation: 'Presign failed' }));
  });

  it('disputeResponse prop forwarded as pre-population to each step', async () => {
    const disputeResponse = { product_description: 'Pre-filled product', customer_name: 'Jane Doe' };
    const page = await setupWizardPage(disputeResponse);

    const productStep = responseRoot(page).querySelector('product-or-service');
    expect((productStep as any).disputeResponse).toEqual(disputeResponse);
  });
});
