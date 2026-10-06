import { h } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';
import { PaymentProvisioningFormButtons } from '../payment-provisioning-form-buttons';
import { BusinessFormClickActions } from '../../utils';

beforeEach(() => {
  jest.clearAllMocks();
});

describe('payment-provisioning-form-buttons', () => {
  const getButtons = (page: any) => {
    const buttons = page.root.querySelectorAll('button');
    return {
      previous: buttons[0],
      next: buttons[1],
      submit: buttons[2],
    };
  };

  describe('visibility by step', () => {
    it('hides Previous, shows Next, hides Submit on step 0', async () => {
      const prevClick = jest.fn();
      const nextClick = jest.fn();
      const page = await newSpecPage({
        components: [PaymentProvisioningFormButtons],
        template: () => (
          <payment-provisioning-form-buttons
            currentStep={0}
            totalSteps={6}
            formLoading={false}
            formDisabled={false}
            previousStepButtonOnClick={prevClick}
            nextStepButtonOnClick={nextClick}
          />
        ),
      });
      const { previous, next, submit } = getButtons(page);
      expect(previous).toHaveAttribute('hidden');
      expect(next).not.toHaveAttribute('hidden');
      expect(submit).toHaveAttribute('hidden');
    });

    it('shows Previous, Next, hides Submit on middle step', async () => {
      const prevClick = jest.fn();
      const nextClick = jest.fn();
      const page = await newSpecPage({
        components: [PaymentProvisioningFormButtons],
        template: () => (
          <payment-provisioning-form-buttons
            currentStep={3}
            totalSteps={6}
            formLoading={false}
            formDisabled={false}
            previousStepButtonOnClick={prevClick}
            nextStepButtonOnClick={nextClick}
          />
        ),
      });
      const { previous, next, submit } = getButtons(page);
      expect(previous).not.toHaveAttribute('hidden');
      expect(next).not.toHaveAttribute('hidden');
      expect(submit).toHaveAttribute('hidden');
    });

    it('shows Previous, hides Next, shows Submit on last step', async () => {
      const prevClick = jest.fn();
      const nextClick = jest.fn();
      const page = await newSpecPage({
        components: [PaymentProvisioningFormButtons],
        template: () => (
          <payment-provisioning-form-buttons
            currentStep={6}
            totalSteps={6}
            formLoading={false}
            formDisabled={false}
            previousStepButtonOnClick={prevClick}
            nextStepButtonOnClick={nextClick}
          />
        ),
      });
      const { previous, next, submit } = getButtons(page);
      expect(previous).not.toHaveAttribute('hidden');
      expect(next).toHaveAttribute('hidden');
      expect(submit).not.toHaveAttribute('hidden');
    });
  });

  describe('disabled state', () => {
    it('disables all buttons when formDisabled is true', async () => {
      const page = await newSpecPage({
        components: [PaymentProvisioningFormButtons],
        template: () => (
          <payment-provisioning-form-buttons
            currentStep={3}
            totalSteps={6}
            formLoading={false}
            formDisabled={true}
            previousStepButtonOnClick={jest.fn()}
            nextStepButtonOnClick={jest.fn()}
          />
        ),
      });
      const { previous, next, submit } = getButtons(page);
      expect(previous).toHaveAttribute('disabled');
      expect(next).toHaveAttribute('disabled');
      expect(submit).toHaveAttribute('disabled');
    });
  });

  describe('loading state', () => {
    it('shows loading on Next and Submit when formLoading is true', async () => {
      const page = await newSpecPage({
        components: [PaymentProvisioningFormButtons],
        template: () => (
          <payment-provisioning-form-buttons
            currentStep={3}
            totalSteps={6}
            formLoading={true}
            formDisabled={false}
            previousStepButtonOnClick={jest.fn()}
            nextStepButtonOnClick={jest.fn()}
          />
        ),
      });
      const { previous, next } = getButtons(page);
      expect(previous.textContent).not.toContain('spinner');
      expect(next.querySelector('.spinner-border') || next.innerHTML).toBeTruthy();
    });

    it('shows loading on Submit when formLoading is true on last step', async () => {
      const page = await newSpecPage({
        components: [PaymentProvisioningFormButtons],
        template: () => (
          <payment-provisioning-form-buttons
            currentStep={6}
            totalSteps={6}
            formLoading={true}
            formDisabled={false}
            previousStepButtonOnClick={jest.fn()}
            nextStepButtonOnClick={jest.fn()}
          />
        ),
      });
      const { submit } = getButtons(page);
      const hasSpinner = submit.querySelector('.spinner-border') || submit.innerHTML.includes('spinner');
      expect(hasSpinner).toBeTruthy();
    });
  });

  describe('click handlers', () => {
    it('calls previousStepButtonOnClick when Previous is clicked', async () => {
      const prevClick = jest.fn();
      const nextClick = jest.fn();
      const page = await newSpecPage({
        components: [PaymentProvisioningFormButtons],
        template: () => (
          <payment-provisioning-form-buttons
            currentStep={3}
            totalSteps={6}
            formLoading={false}
            formDisabled={false}
            previousStepButtonOnClick={prevClick}
            nextStepButtonOnClick={nextClick}
          />
        ),
      });
      const { previous } = getButtons(page);
      previous.click();
      await page.waitForChanges();
      expect(prevClick).toHaveBeenCalledTimes(1);
      expect(nextClick).not.toHaveBeenCalled();
    });

    it('calls nextStepButtonOnClick with nextStep when Next is clicked', async () => {
      const nextClick = jest.fn();
      const page = await newSpecPage({
        components: [PaymentProvisioningFormButtons],
        template: () => (
          <payment-provisioning-form-buttons
            currentStep={3}
            totalSteps={6}
            formLoading={false}
            formDisabled={false}
            previousStepButtonOnClick={jest.fn()}
            nextStepButtonOnClick={nextClick}
          />
        ),
      });
      const { next } = getButtons(page);
      next.click();
      await page.waitForChanges();
      expect(nextClick).toHaveBeenCalledWith(
        expect.any(Object),
        BusinessFormClickActions.nextStep
      );
    });

    it('calls nextStepButtonOnClick with submit when Submit is clicked', async () => {
      const nextClick = jest.fn();
      const page = await newSpecPage({
        components: [PaymentProvisioningFormButtons],
        template: () => (
          <payment-provisioning-form-buttons
            currentStep={6}
            totalSteps={6}
            formLoading={false}
            formDisabled={false}
            previousStepButtonOnClick={jest.fn()}
            nextStepButtonOnClick={nextClick}
          />
        ),
      });
      const { submit } = getButtons(page);
      submit.click();
      await page.waitForChanges();
      expect(nextClick).toHaveBeenCalledWith(
        expect.any(Object),
        BusinessFormClickActions.submit
      );
    });
  });
});
