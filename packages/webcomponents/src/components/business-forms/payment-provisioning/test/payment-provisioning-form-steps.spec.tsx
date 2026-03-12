import { h } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';
import { PaymentProvisioningFormSteps } from '../payment-provisioning-form-steps';
import { CountryCode } from '../../../../utils/country-codes';

const STEP_TAGS = [
  'business-core-info-form-step',
  'legal-address-form-step',
  'additional-questions-form-step',
  'business-representative-form-step',
  'business-owners-form-step',
  'business-bank-account-form-step',
  'business-terms-conditions-form-step',
] as const;

async function setupComponent(
  currentStep: number,
  overrides: Partial<{
    businessId: string;
    authToken: string;
    allowOptionalFields: boolean;
    country: CountryCode;
    handleFormLoading: (e: CustomEvent) => void;
  }> = {}
) {
  const refs: any[] = [];
  const page = await newSpecPage({
    components: [PaymentProvisioningFormSteps],
    template: () => (
      <payment-provisioning-form-steps
        businessId={overrides.businessId ?? 'biz_123'}
        authToken={overrides.authToken ?? 'test-token'}
        refs={refs}
        currentStep={currentStep}
        allowOptionalFields={overrides.allowOptionalFields ?? false}
        country={overrides.country ?? CountryCode.USA}
        handleFormLoading={overrides.handleFormLoading ?? jest.fn()}
      />
    ),
  });
  await page.waitForChanges();
  return { page, refs };
}

describe('payment-provisioning-form-steps', () => {
  describe('step rendering', () => {
    it.each(STEP_TAGS.map((tag, i) => [tag, i] as const))(
      'renders %s on step %i',
      async (tag, step) => {
        const { page } = await setupComponent(step);
        const child = page.root.querySelector(tag);
        expect(child).not.toBeNull();
      }
    );

    it('only renders one child element at a time', async () => {
      const { page } = await setupComponent(3);
      const wrapper = page.root.querySelector('div.col-12.mb-4');
      expect(wrapper).not.toBeNull();
      expect(wrapper.children.length).toBe(1);
    });
  });

  describe('prop forwarding', () => {
    it('passes businessId and authToken to steps 0, 3, 6', async () => {
      const { page } = await setupComponent(0);
      const child = page.root.querySelector('business-core-info-form-step');
      const businessId =
        (child as any).businessId ??
        child?.getAttribute('business-id') ??
        child?.getAttribute('businessid');
      const authToken =
        (child as any).authToken ??
        child?.getAttribute('auth-token') ??
        child?.getAttribute('authtoken');
      expect(businessId).toBe('biz_123');
      expect(authToken).toBe('test-token');

      const { page: page3 } = await setupComponent(3);
      const child3 = page3.root.querySelector('business-representative-form-step');
      expect(
        (child3 as any).businessId ?? child3?.getAttribute('business-id') ?? child3?.getAttribute('businessid')
      ).toBe('biz_123');
      expect(
        (child3 as any).authToken ?? child3?.getAttribute('auth-token') ?? child3?.getAttribute('authtoken')
      ).toBe('test-token');

      const { page: page6 } = await setupComponent(6);
      const child6 = page6.root.querySelector('business-terms-conditions-form-step');
      expect(
        (child6 as any).businessId ?? child6?.getAttribute('business-id') ?? child6?.getAttribute('businessid')
      ).toBe('biz_123');
      expect(
        (child6 as any).authToken ?? child6?.getAttribute('auth-token') ?? child6?.getAttribute('authtoken')
      ).toBe('test-token');
    });

    it('passes allowOptionalFields to every step', async () => {
      const { page } = await setupComponent(2, { allowOptionalFields: true });
      const child = page.root.querySelector('additional-questions-form-step');
      const val =
        (child as any).allowOptionalFields ??
        child?.getAttribute('allow-optional-fields') ??
        child?.getAttribute('allowoptionalfields');
      expect(val === true || val === '' || val === 'true').toBe(true);
    });

    it('passes country to steps 0, 1, 3, 4, 5', async () => {
      const stepsWithCountry = [0, 1, 3, 4, 5];
      for (const step of stepsWithCountry) {
        const { page } = await setupComponent(step, { country: CountryCode.CAN });
        const child = page.root.querySelector(STEP_TAGS[step]);
        expect(child?.getAttribute('country')).toBe(CountryCode.CAN);
      }
    });

    it('does NOT pass country to step 2 (additional-questions)', async () => {
      const { page } = await setupComponent(2, { country: CountryCode.CAN });
      const child = page.root.querySelector('additional-questions-form-step');
      expect(child?.getAttribute('country')).toBeNull();
    });

    it('does NOT pass country to step 6 (terms-and-conditions)', async () => {
      const { page } = await setupComponent(6, { country: CountryCode.CAN });
      const child = page.root.querySelector('business-terms-conditions-form-step');
      expect(child?.getAttribute('country')).toBeNull();
    });

    it('does NOT pass onFormLoading to steps 0-5', async () => {
      const handleFormLoading = jest.fn();
      const { page } = await setupComponent(0, { handleFormLoading });
      const child = page.root.querySelector('business-core-info-form-step');
      expect((child as any).onFormLoading).toBeUndefined();
    });
  });

  describe('refs', () => {
    it('sets refs[n] to the rendered child element for each step n', async () => {
      for (let step = 0; step <= 6; step++) {
        const { page, refs } = await setupComponent(step);
        const child = page.root.querySelector(STEP_TAGS[step]);
        expect(refs[step]).toBe(child);
      }
    });
  });
});
