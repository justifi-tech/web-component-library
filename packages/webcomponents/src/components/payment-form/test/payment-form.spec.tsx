import { newSpecPage } from '@stencil/core/testing';
import { PaymentForm } from '../payment-form';
import { PaymentMethodTypes } from '../../../api';
import { BillingFormFields } from '../../billing-form/billing-form-schema';
import { config } from '../../../../config';

describe('justifi-payment-form', () => {
  it('should update submitButtonEnabled state when enableSubmitButton method is called', async () => {
    // Mock component
    const mockComponent = new PaymentForm();
    mockComponent.submitButtonEnabled = false;

    // Call the method
    await mockComponent.enableSubmitButton();

    // Assertion
    expect(mockComponent.submitButtonEnabled).toBe(true);
  });

  it('should update selectedPaymentMethodType when paymentMethodSelected event is fired', async () => {
    // Mock component
    const mockComponent = new PaymentForm();
    mockComponent.selectedPaymentMethodType = PaymentMethodTypes.card;

    // Define the event details
    const detail = PaymentMethodTypes.bankAccount;
    const event = new CustomEvent('paymentMethodSelected', { detail });

    // Simulate the event
    mockComponent.paymentMethodSelectedHandler(event);

    // Assertion
    expect(mockComponent.selectedPaymentMethodType).toBe(PaymentMethodTypes.bankAccount);
  });

  // Props Testing
  it('should have the expected default properties', () => {
    const paymentForm = new PaymentForm();

    // Assert that the properties exist and have the expected default values
    expect(paymentForm).toHaveProperty('bankAccount', undefined);
    expect(paymentForm).toHaveProperty('card', true);
    expect(paymentForm).toHaveProperty('email', undefined);
    expect(paymentForm).toHaveProperty('clientId', undefined);
    expect(paymentForm).toHaveProperty('accountId', undefined);
    expect(paymentForm).toHaveProperty('submitButtonText', undefined);
  });

  // Method Testing
  it('should correctly fill billing form when fillBillingForm method is called', async () => {
    // Mock child component
    const mockBillingFormRef = {
      fill: jest.fn(),
    };

    // Mock component
    const mockComponent = new PaymentForm();

    // Cast to any to bypass type checker and directly set private property
    (mockComponent as any).billingFormRef = mockBillingFormRef;

    // Define the fields to fill the billing form
    const fields: BillingFormFields = {
      name: 'John Doe',
      address_line1: '123 Main St',
      address_line2: 'Apt 4B',
      address_city: 'Townsville',
      address_state: 'TS',
      address_postal_code: '12345',
    };

    // Call the method
    await mockComponent.fillBillingForm(fields);

    // Check that the child component's fill method was called with the correct arguments
    expect(mockBillingFormRef.fill).toHaveBeenCalledWith(fields);
  });

  it('should submit the form correctly and trigger the "submitted" event with the correct payload when submit method is called', async () => {
    // Mock billingFormRef and paymentMethodFormRef
    const mockBillingFormRef = {
      validate: jest.fn().mockResolvedValue({ isValid: true }),
      getValues: jest.fn().mockResolvedValue({ name: 'John Doe' }),
    };

    const mockPaymentMethodFormRef = {
      validate: jest.fn().mockResolvedValue({ isValid: true }),
      tokenize: jest.fn().mockResolvedValue({ token: 'abc123' }),
    };

    // Mock component
    const mockComponent = new PaymentForm();

    // Cast to any to bypass type checker and directly set private properties
    (mockComponent as any).billingFormRef = mockBillingFormRef;
    (mockComponent as any).paymentMethodFormRef = mockPaymentMethodFormRef;

    // Mock event
    const mockEvent = { preventDefault: jest.fn() };

    // Mock event emitter
    const mockEmitter = { emit: jest.fn() };
    mockComponent.submitted = mockEmitter as any;

    // Call submit method
    await mockComponent.submit(mockEvent);

    // Expectations
    expect(mockEvent.preventDefault).toHaveBeenCalled();
    expect(mockBillingFormRef.validate).toHaveBeenCalled();
    expect(mockPaymentMethodFormRef.validate).toHaveBeenCalled();
    expect(mockBillingFormRef.getValues).toHaveBeenCalled();
    expect(mockPaymentMethodFormRef.tokenize).toHaveBeenCalledWith(mockComponent.clientId, { email: mockComponent.email, name: 'John Doe' }, mockComponent.accountId);
    expect(mockEmitter.emit).toHaveBeenCalledWith({ token: 'abc123' });
  });

  // Event Testing
  it('should fire the "submitted" event with correct data when the form is submitted', async () => {
    // Mock billingFormRef and paymentMethodFormRef
    const mockBillingFormRef = {
      validate: jest.fn().mockResolvedValue({ isValid: true }),
      getValues: jest.fn().mockResolvedValue({
        name: 'John Doe',
        address_line1: 'Address 1',
        address_line2: 'Address 2',
        address_city: 'City',
        address_state: 'State',
        address_postal_code: 'Postal Code',
      }),
    };

    const mockPaymentMethodFormRef = {
      validate: jest.fn().mockResolvedValue({ isValid: true }),
      tokenize: jest.fn().mockResolvedValue({ token: 'abc123' }),
    };

    // Mock component
    const mockComponent = new PaymentForm();
    mockComponent.email = 'john@example.com'; // set email prop

    // Cast to any to bypass type checker and directly set private properties
    (mockComponent as any).billingFormRef = mockBillingFormRef;
    (mockComponent as any).paymentMethodFormRef = mockPaymentMethodFormRef;

    // Mock event
    const mockEvent = { preventDefault: jest.fn() };

    // Mock event emitter
    const mockEmitter = { emit: jest.fn() };
    mockComponent.submitted = mockEmitter as any;

    // Call submit method
    await mockComponent.submit(mockEvent);

    // Define expected payload
    const expectedPayload = { token: 'abc123' };

    // Expectations
    expect(mockEmitter.emit).toHaveBeenCalledWith(expectedPayload);
  });

  // Render Testing
  it('should correctly render the child components based on the given props and state', async () => {
    // Set up new PaymentForm with specific props and state
    const component = new PaymentForm();
    component.bankAccount = true;
    component.card = true;
    component.email = 'test@test.com';
    component.clientId = 'abc123';
    component.accountId = 'def456';
    component.submitButtonText = 'Submit';

    // Cast to any to bypass type checker and directly set private properties
    (component as any).submitButtonEnabled = true;
    (component as any).selectedPaymentMethodType = PaymentMethodTypes.card;
    (component as any).allowedPaymentMethodTypes = [PaymentMethodTypes.card, PaymentMethodTypes.bankAccount];

    // Render the component
    const { root } = await newSpecPage({
      components: [PaymentForm],
      html: `<justifi-payment-form payment-method-form-type="card"></justifi-payment-form>`,
    });

    // Assert that the rendered output is correct
    expect(root).toEqualHtml(`
      <justifi-payment-form payment-method-form-type="card">
        <mock:shadow-root>
          <form class="gy-3 row">
            <div class="col-12">
              <justifi-payment-method-form payment-method-form-type="card" iframeorigin="${config.iframeOrigin}"></justifi-payment-method-form>
            </div>
            <div class="col-12">
              <justifi-billing-form legend="Billing Info"></justifi-billing-form>
            </div>
            <slot name="insurance"></slot>
            <div class="col-12">
              <button class="btn btn-primary jfi-submit-button" type="submit">
                Submit
              </button>
            </div>
          </form>
        </mock:shadow-root>
      </justifi-payment-form>
    `);
  });
});
